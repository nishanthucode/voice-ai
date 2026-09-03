import { NextResponse } from 'next/server';
import { DEMO_USER, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    // Support demo credentials demo@auravoice.ai / demo123 or 1-click login
    if ((email === 'demo@auravoice.ai' && password === 'demo123') || !email) {
      const token = signToken(DEMO_USER);
      const res = NextResponse.json({ success: true, user: DEMO_USER });
      res.cookies.set('aura_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    // Default demo login for any credentials in demo environment
    const user = { userId: `user_${Date.now()}`, email: email || 'demo@auravoice.ai', name: email?.split('@')[0] || 'Demo User' };
    const token = signToken(user);
    const res = NextResponse.json({ success: true, user });
    res.cookies.set('aura_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
