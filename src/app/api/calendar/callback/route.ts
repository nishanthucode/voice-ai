import { NextResponse } from 'next/server';
import { calendarService } from '@/lib/services/google-calendar';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const businessId = searchParams.get('state') || 'biz_bakery_01';

  if (!code) {
    return NextResponse.redirect(new URL('/integrations?error=missing_oauth_code', req.url));
  }

  try {
    const success = await calendarService.handleOAuthCallback(code, businessId);
    if (success) {
      return NextResponse.redirect(new URL('/integrations?success=google_calendar_connected', req.url));
    } else {
      return NextResponse.redirect(new URL('/integrations?error=oauth_exchange_failed', req.url));
    }
  } catch (err) {
    console.error('[OAuth Callback Error]', err);
    return NextResponse.redirect(new URL('/integrations?error=oauth_exception', req.url));
  }
}
