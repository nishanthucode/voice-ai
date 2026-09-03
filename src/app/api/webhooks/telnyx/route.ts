import { NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db/supabase';
import { geminiService } from '@/lib/services/gemini';

/**
 * Telnyx TeXML Webhook Handler
 * 
 * Telnyx TeXML uses the same XML verbs as TwiML (<Gather>, <Say>, <Hangup>)
 * so this is nearly identical to the Twilio webhook. The main difference
 * is the parameter names in the webhook body:
 * - CallSid (same as Twilio in TeXML mode)
 * - SpeechResult (same as Twilio in TeXML mode)
 * - From / To (same as Twilio)
 * 
 * Set your Telnyx TeXML App webhook URL to:
 * https://<your-vercel-url>/api/webhooks/telnyx
 */
export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);

    const from = params.get('From');
    const callSid = params.get('CallSid');       // Telnyx TeXML uses same name
    const speechResult = params.get('SpeechResult'); // Same as TwiML

    // Look up the first available business and its workflow
    const business = dbRepo.businesses[0];
    const workflow = dbRepo.getWorkflowsByBusiness(business.id)[0];

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://voice-ai-iu7q.vercel.app';
    const gatherUrl = `${appUrl}/api/webhooks/telnyx`;

    // ─────────────────────────────────────────────
    // A) NEW CALL — no speech yet, send greeting
    // ─────────────────────────────────────────────
    if (!speechResult) {
      console.log(`[Telnyx] New call: ${callSid} from ${from}`);

      dbRepo.createConversation({
        id: callSid || undefined,
        business_id: business.id,
        workflow_id: workflow.id,
        phone_number: from || 'Unknown',
        caller_name: 'Voice Caller',
        intent: 'Inbound Phone Call',
        summary: 'Call started...',
        status: 'ACTIVE',
      });

      const greeting =
        workflow.greeting ||
        `Hello, thank you for calling ${business.name}. How can I help you today?`;

      if (callSid) dbRepo.addMessage(callSid, 'assistant', greeting);

      const texml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" action="${gatherUrl}" speechTimeout="auto" language="en-IN">
        <Say voice="Polly.Joanna">${greeting}</Say>
    </Gather>
</Response>`;

      return new NextResponse(texml, { headers: { 'Content-Type': 'text/xml' } });
    }

    // ─────────────────────────────────────────────
    // B) FOLLOW-UP TURN — user just spoke
    // ─────────────────────────────────────────────
    console.log(`[Telnyx] User said: "${speechResult}" (call ${callSid})`);

    if (callSid) dbRepo.addMessage(callSid, 'user', speechResult);

    const history = callSid
      ? dbRepo.messages
          .filter(m => m.conversation_id === callSid)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      : [];

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

    if (callSid) dbRepo.addMessage(callSid, 'assistant', aiResponse.reply);

    // Update conversation record
    const conv = dbRepo.conversations.find(c => c.id === callSid);
    if (conv) {
      conv.summary = aiResponse.summary;
      conv.intent = aiResponse.intent;
      conv.priority = aiResponse.priority;
      if (aiResponse.isCompleted) conv.status = 'COMPLETED';
    }

    // ─────────────────────────────────────────────
    // C) BUILD TEXML RESPONSE (same syntax as TwiML)
    // ─────────────────────────────────────────────
    let texml: string;
    if (aiResponse.isCompleted) {
      texml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">${aiResponse.reply}</Say>
    <Pause length="1"/>
    <Hangup/>
</Response>`;
    } else {
      texml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" action="${gatherUrl}" speechTimeout="auto" language="en-IN">
        <Say voice="Polly.Joanna">${aiResponse.reply}</Say>
    </Gather>
</Response>`;
    }

    return new NextResponse(texml, { headers: { 'Content-Type': 'text/xml' } });

  } catch (error) {
    console.error('[Telnyx] Webhook error:', error);
    const texml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">I am sorry, there was an issue connecting to my brain. Please try again shortly.</Say>
    <Hangup/>
</Response>`;
    return new NextResponse(texml, { headers: { 'Content-Type': 'text/xml' } });
  }
}
