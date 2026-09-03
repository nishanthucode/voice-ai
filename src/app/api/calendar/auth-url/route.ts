import { NextResponse } from 'next/server';
import { calendarService } from '@/lib/services/google-calendar';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('business_id') || 'biz_bakery_01';
  const url = calendarService.generateAuthUrl(businessId);
  return NextResponse.json({ url });
}
