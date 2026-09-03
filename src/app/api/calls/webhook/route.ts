import { NextResponse } from 'next/server';
import { twilioService } from '@/lib/services/twilio';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const params = {
      CallSid: (formData.get('CallSid') as string) || `CA_fake_${Date.now()}`,
      From: (formData.get('From') as string) || '+15552345678',
      To: (formData.get('To') as string) || '+15559876543',
      CallStatus: (formData.get('CallStatus') as string) || 'no-answer',
      BusinessId: (formData.get('BusinessId') as string) || 'biz_bakery_01',
    };

    const callRecord = twilioService.handleMissedCallWebhook(params);

    // Auto-initiate callback for missed call lifecycle
    const callbackRes = await twilioService.initiateCallback(callRecord.id);

    return NextResponse.json({
      success: true,
      message: 'Missed call logged and callback queued.',
      callRecord,
      callbackResult: callbackRes,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
