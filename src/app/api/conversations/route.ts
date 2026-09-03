import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { dbRepo } from '@/lib/db/supabase';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('business_id');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const workflowId = searchParams.get('workflow_id');

  let list = dbRepo.conversations;

  if (businessId) {
    list = list.filter(c => c.business_id === businessId);
  }

  if (status) {
    list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }

  if (priority) {
    list = list.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
  }

  if (workflowId) {
    list = list.filter(c => c.workflow_id === workflowId);
  }

  const detailedList = list.map(c => dbRepo.getConversationFullDetails(c.id));
  return NextResponse.json({ conversations: detailedList });
}
