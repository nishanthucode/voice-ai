import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { dbRepo } from '@/lib/db/supabase';

export async function POST(req: Request) {
  try {
    const { customerPhone, businessId, workflowId } = await req.json();

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      return NextResponse.json({ error: 'Missing Twilio credentials in environment' }, { status: 500 });
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // The Webhook URL where Twilio will fetch the TwiML script when the customer answers the phone
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://voice-ai-iu7q.vercel.app';
    const webhookUrl = `${appUrl}/api/webhooks/twilio`;

    const call = await client.calls.create({
      url: webhookUrl,
      to: customerPhone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log('Outbound callback initiated:', call.sid);

    return NextResponse.json({ success: true, callSid: call.sid });
  } catch (error: any) {
    console.error('Failed to initiate callback:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
