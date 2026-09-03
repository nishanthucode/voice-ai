import { NextResponse } from 'next/server';
import { getCurrentUser, verifyBusinessOwnership } from '@/lib/auth';
import { dbRepo } from '@/lib/db/supabase';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('business_id');

  if (businessId) {
    if (!verifyBusinessOwnership(user.userId, businessId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const workflows = dbRepo.getWorkflowsByBusiness(businessId).map(w => dbRepo.getWorkflowWithDetails(w.id));
    return NextResponse.json({ workflows });
  }

  const allWorkflows = dbRepo.workflows.map(w => dbRepo.getWorkflowWithDetails(w.id));
  return NextResponse.json({ workflows: allWorkflows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { business_id, name, description, greeting, closing_message, language, fields, conditions, actions } = body;

    if (!verifyBusinessOwnership(user.userId, business_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const workflowId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newWf = {
      id: workflowId,
      business_id,
      name: name || 'Custom Workflow',
      description: description || '',
      trigger_type: 'MISSED_CALL' as const,
      greeting: greeting || 'Hello! Thank you for calling.',
      closing_message: closing_message || 'Thank you, we will contact you soon.',
      language: language || 'en',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dbRepo.workflows.push(newWf);

    // Insert dynamic fields
    if (fields && Array.isArray(fields)) {
      fields.forEach((f: any, idx: number) => {
        dbRepo.fields.push({
          id: `f_${Date.now()}_${idx}`,
          workflow_id: workflowId,
          name: f.name,
          label: f.label,
          question: f.question,
          data_type: f.data_type || 'string',
          required: Boolean(f.required),
          order_index: idx + 1,
          validation_config: f.validation_config,
          created_at: new Date().toISOString(),
        });
      });
    }

    // Insert conditions
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((c: any, idx: number) => {
        dbRepo.conditions.push({
          id: `cond_${Date.now()}_${idx}`,
          workflow_id: workflowId,
          field_name: c.field_name,
          operator: c.operator,
          comparison_value: c.comparison_value,
          action_config: c.action_config || { set_priority: 'high' },
          created_at: new Date().toISOString(),
        });
      });
    }

    const fullWorkflow = dbRepo.getWorkflowWithDetails(workflowId);
    return NextResponse.json({ success: true, workflow: fullWorkflow }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
