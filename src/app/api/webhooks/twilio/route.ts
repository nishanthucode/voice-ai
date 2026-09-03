import { NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db/supabase';

// Helper to generate TwiML for Voice
const generateVoiceTwiML = (message: string) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna">${message}</Say>
    <!-- For a real Pipecat streaming AI, we would use <Connect><Stream url="wss://..." /></Connect> here -->
    <Pause length="2"/>
    <Say>Goodbye.</Say>
</Response>`;
};

export async function POST(req: Request) {
  try {
    // Twilio sends data as URL Encoded form data
    const text = await req.text();
    const params = new URLSearchParams(text);

    const from = params.get('From');
    const to = params.get('To');
    const body = params.get('Body'); // Used for SMS
    const callStatus = params.get('CallStatus'); // Used for Voice

    console.log(`[Twilio Webhook] Received event from ${from} to ${to}`);

    if (callStatus) {
      // --- VOICE HANDLER ---
      console.log(`[Twilio Voice] Call status: ${callStatus}`);
      const business = dbRepo.businesses[0];
      
      const greetingMessage = `Hello, thank you for calling ${business.name}. I am the AI Receptionist. I am currently operating in demo mode. Please check the dashboard to view your call records.`;

      // Log this in the DB
      dbRepo.createConversation({
        business_id: business.id,
        workflow_id: 'wf_cake_order_01',
        phone_number: from || 'Unknown',
        caller_name: 'Voice Caller',
        intent: 'Phone Call',
        summary: `Customer called. Voice integration in progress.`,
        status: 'COMPLETED'
      });

      return new NextResponse(generateVoiceTwiML(greetingMessage), {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    return new NextResponse('OK');
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
