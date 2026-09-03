import { NextResponse } from 'next/server';

/**
 * Telnyx Outbound Callback Route
 * 
 * Telnyx does NOT have an npm helper library (unlike Twilio).
 * Instead we call their REST API directly with a Bearer token.
 * 
 * API Reference: POST https://api.telnyx.com/v2/calls
 * Docs: https://developers.telnyx.com/docs/voice/calls/calls-api
 * 
 * Required env vars:
 *   TELNYX_API_KEY        — Your Telnyx API v2 key (starts with "KEY...")
 *   TELNYX_PHONE_NUMBER   — Your Telnyx DID in E.164 format, e.g. +14155551234
 *   TELNYX_APP_ID         — Your TeXML Application ID (found in Telnyx portal → Voice → TeXML Apps)
 */
export async function POST(req: Request) {
  try {
    const { customerPhone } = await req.json();

    const apiKey = process.env.TELNYX_API_KEY;
    const fromNumber = process.env.TELNYX_PHONE_NUMBER;
    const appId = process.env.TELNYX_APP_ID;

    if (!apiKey || !fromNumber) {
      return NextResponse.json(
        { error: 'Missing TELNYX_API_KEY or TELNYX_PHONE_NUMBER in environment variables' },
        { status: 500 }
      );
    }

    // Sanitise to strict E.164 (strip spaces, dashes, parentheses)
    const cleanPhone = customerPhone.replace(/[\s\-()]/g, '');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://voice-ai-iu7q.vercel.app';
    const webhookUrl = `${appUrl}/api/webhooks/telnyx`;

    // Telnyx Calls API — same as Twilio but REST JSON, no SDK needed
    const body: Record<string, any> = {
      connection_id: appId,   // TeXML App ID (links to your webhook URL)
      to: cleanPhone,
      from: fromNumber,
      // texml_application_id is the same as connection_id for TeXML apps
    };

    const response = await fetch('https://api.telnyx.com/v2/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Telnyx] Call creation failed:', data);
      const errMsg = data?.errors?.[0]?.detail || data?.title || 'Unknown Telnyx error';
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    console.log('[Telnyx] Outbound call initiated:', data?.data?.call_control_id);
    return NextResponse.json({ success: true, callId: data?.data?.call_control_id });

  } catch (error: any) {
    console.error('[Telnyx] Failed to initiate callback:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
