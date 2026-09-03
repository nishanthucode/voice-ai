import { NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db/supabase';
import { geminiService } from '@/lib/services/gemini';

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);

    const from = params.get('From');
    const to = params.get('To');
    const callStatus = params.get('CallStatus');
    const callSid = params.get('CallSid'); // Unique ID for this phone call
    const speechResult = params.get('SpeechResult'); // What the user said (if coming from Gather)

    if (!callStatus && !speechResult && !callSid) {
      return new NextResponse('OK');
    }

    const business = dbRepo.businesses[0];
    const workflow = dbRepo.getWorkflowsByBusiness(business.id)[0];
    
    // Fallback to local URL if not deployed, but typically this is hit from outside
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://voice-ai-iu7q.vercel.app';
    const gatherUrl = `${appUrl}/api/webhooks/twilio`;

    // If it's a new incoming call (no speech result yet)
    if (!speechResult) {
      console.log(`[Twilio Voice] New Call started: ${callSid}`);
      
      // Create a new conversation in the DB using the CallSid
      dbRepo.createConversation({
        id: callSid || undefined,
        business_id: business.id,
        workflow_id: workflow.id,
        phone_number: from || 'Unknown',
        caller_name: 'Voice Caller',
        intent: 'Inbound Phone Call',
        summary: `Call started...`,
        status: 'ACTIVE'
      });

      // Send the initial greeting
      const greeting = workflow.greeting || `Hello, thank you for calling ${business.name}. How can I help you today?`;
      
      if (callSid) dbRepo.addMessage(callSid, 'assistant', greeting);

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" action="${gatherUrl}" speechTimeout="auto" language="en-US">
        <Say voice="Polly.Joanna">${greeting}</Say>
    </Gather>
</Response>`;

      return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
    }

    // --- TURN-BY-TURN AI CONVERSATION (Handling SpeechResult) ---
    console.log(`[Twilio Voice] User said: ${speechResult}`);
    

    if (callSid) dbRepo.addMessage(callSid, 'user', speechResult);

    // Get conversation history
    const history = callSid ? dbRepo.messages.filter(m => m.conversation_id === callSid).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : [];

    // Process with Gemini AI
    const workflowDetails = dbRepo.getWorkflowWithDetails(workflow.id);
    const fields = workflowDetails?.fields || [];
    const conditions = workflowDetails?.conditions || [];

    const aiResponse = await geminiService.processTurn(
      callSid || '',
      business,
      workflow,
      fields,
      conditions,
      history,
      speechResult
    );

    // Save AI response to DB
    if (callSid) dbRepo.addMessage(callSid, 'assistant', aiResponse.reply);

    // Update conversation state (fields, summary)
    const conv = dbRepo.conversations.find(c => c.id === callSid);
    if (conv) {
      conv.summary = aiResponse.summary;
      conv.intent = aiResponse.intent;
      conv.priority = aiResponse.priority;
      if (aiResponse.isCompleted) {
         conv.status = 'COMPLETED';
      }
    }

    // Generate TwiML response
    let twiml = '';
    if (aiResponse.isCompleted) {
       twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">${aiResponse.reply}</Say>
    <Pause length="1"/>
    <Hangup/>
</Response>`;
    } else {
       twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" action="${gatherUrl}" speechTimeout="auto" language="en-US">
        <Say voice="Polly.Joanna">${aiResponse.reply}</Say>
    </Gather>
</Response>`;
    }

    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });

  } catch (error) {
    console.error('Twilio webhook error:', error);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">I'm sorry, I am having trouble connecting to my brain. Please try again later.</Say>
    <Hangup/>
</Response>`;
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } });
  }
}
