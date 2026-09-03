import { NextResponse } from 'next/server';
import { twilioService } from '@/lib/services/twilio';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { call_record_id } = body;

    const res = await twilioService.initiateCallback(call_record_id);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
