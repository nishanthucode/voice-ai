import { NextResponse } from 'next/server';
import { dbRepo, INITIAL_BUSINESSES, INITIAL_WORKFLOWS, INITIAL_FIELDS, INITIAL_CONDITIONS, INITIAL_ACTIONS, INITIAL_CONVERSATIONS, INITIAL_CONVERSATION_FIELDS, INITIAL_MESSAGES, INITIAL_TOOL_CALLS } from '@/lib/db/supabase';

export async function POST() {
  dbRepo.businesses = [...INITIAL_BUSINESSES];
  dbRepo.workflows = [...INITIAL_WORKFLOWS];
  dbRepo.fields = [...INITIAL_FIELDS];
  dbRepo.conditions = [...INITIAL_CONDITIONS];
  dbRepo.actions = [...INITIAL_ACTIONS];
  dbRepo.conversations = [...INITIAL_CONVERSATIONS];
  dbRepo.conversationFields = [...INITIAL_CONVERSATION_FIELDS];
  dbRepo.messages = [...INITIAL_MESSAGES];
  dbRepo.toolCalls = [...INITIAL_TOOL_CALLS];

  return NextResponse.json({
    success: true,
    message: 'Demo dataset re-seeded successfully!',
  });
}
