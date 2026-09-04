import { NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db/supabase';
import { geminiService } from '@/lib/services/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversation_id, business_id, workflow_id, user_message, language = 'en' } = body;

    const bizId = business_id || 'biz_bakery_01';
    const business = dbRepo.getBusiness(bizId);

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 400 });
    }

    let workflow = workflow_id ? dbRepo.getWorkflowWithDetails(workflow_id) : undefined;
    if (!workflow || workflow.business_id !== bizId) {
      const bizWorkflows = dbRepo.getWorkflowsByBusiness(bizId);
      workflow = bizWorkflows.length > 0 ? dbRepo.getWorkflowWithDetails(bizWorkflows[0].id) : undefined;
    }

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found for business' }, { status: 400 });
    }

    let conversation = conversation_id ? dbRepo.conversations.find(c => c.id === conversation_id) : undefined;

    if (!conversation) {
      conversation = dbRepo.createConversation({
        business_id: bizId,
        workflow_id: workflow.id,
        caller_name: 'Simulated Caller',
        phone_number: '+1 (555) 321-7654',
        language: language as 'en' | 'hi',
        status: 'ACTIVE',
      });

      // Add initial greeting message
      dbRepo.addMessage(conversation.id, 'assistant', workflow.greeting);
    }

    // Save user message
    if (user_message && user_message.trim()) {
      dbRepo.addMessage(conversation.id, 'user', user_message);
    }

    // Get message history
    const history = dbRepo.messages.filter(m => m.conversation_id === conversation.id);

    // Process turn with Gemini Engine
    const turnResult = await geminiService.processTurn(
      conversation.id,
      business,
      workflow,
      workflow.fields || [],
      workflow.conditions || [],
      history,
      user_message || '',
      language as 'en' | 'hi'
    );

    // Save assistant reply message
    dbRepo.addMessage(conversation.id, 'assistant', turnResult.reply);

    // Update conversation record status & summary
    dbRepo.updateConversation(conversation.id, {
      intent: turnResult.intent,
      priority: turnResult.priority,
      summary: turnResult.summary,
      caller_name: turnResult.extractedFields.caller_name || conversation.caller_name,
      status: turnResult.isCompleted ? 'COMPLETED' : 'ACTIVE',
      action_status: turnResult.toolCallsExecuted.length > 0 
        ? `Tools Executed: ${turnResult.toolCallsExecuted.map(t => t.name).join(', ')}` 
        : conversation.action_status,
      ended_at: turnResult.isCompleted ? new Date().toISOString() : undefined,
    });

    const fullDetails = dbRepo.getConversationFullDetails(conversation.id);

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      reply: turnResult.reply,
      extractedFields: turnResult.extractedFields,
      conditionsEvaluated: turnResult.conditionsEvaluated,
      toolCallsExecuted: turnResult.toolCallsExecuted,
      isCompleted: turnResult.isCompleted,
      priority: turnResult.priority,
      summary: turnResult.summary,
      fullDetails,
    });
  } catch (err: any) {
    console.error('Simulator Chat Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process chat turn' }, { status: 500 });
  }
}
