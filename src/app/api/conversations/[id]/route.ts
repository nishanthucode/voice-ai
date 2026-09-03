import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { dbRepo } from '@/lib/db/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const details = dbRepo.getConversationFullDetails(id);
  if (!details) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  return NextResponse.json(details);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = dbRepo.updateConversation(id, {
      follow_up_status: body.follow_up_status,
      priority: body.priority,
      status: body.status,
      caller_name: body.caller_name,
    });

    if (!updated) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    return NextResponse.json({ success: true, conversation: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
