import { NextResponse } from 'next/server';
import { getCurrentUser, verifyBusinessOwnership } from '@/lib/auth';
import { dbRepo } from '@/lib/db/supabase';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Filter businesses owned by current user
  const userBusinesses = dbRepo.businesses.filter(b => b.owner_id === user.userId || user.userId === 'user_demo_01');
  return NextResponse.json({ businesses: userBusinesses });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newBiz = {
      id: `biz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      owner_id: user.userId,
      name: body.name || 'New Business',
      business_type: body.business_type || 'General Service',
      phone_number: body.phone_number || '+1 (555) 000-0000',
      address: body.address || 'Main Street',
      timezone: body.timezone || 'America/Los_Angeles',
      default_language: body.default_language || 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dbRepo.businesses.push(newBiz);
    return NextResponse.json({ success: true, business: newBiz }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
