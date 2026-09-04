import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { dbRepo } from '@/lib/db/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wf = dbRepo.getWorkflowWithDetails(id);
  if (!wf) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  return NextResponse.json({ workflow: wf });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const existing = dbRepo.workflows.find(w => w.id === id);
    if (!existing) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });

    // Update workflow fields
    existing.name = body.name ?? existing.name;
    existing.description = body.description ?? existing.description;
    existing.greeting = body.greeting ?? existing.greeting;
    existing.closing_message = body.closing_message ?? existing.closing_message;
    existing.language = body.language ?? existing.language;
    existing.active = body.active ?? existing.active;
    existing.updated_at = new Date().toISOString();

    if (body.fields && Array.isArray(body.fields)) {
      // Replace fields
      dbRepo.fields = dbRepo.fields.filter(f => f.workflow_id !== id);
      body.fields.forEach((f: any, idx: number) => {
        dbRepo.fields.push({
          id: f.id || `f_${Date.now()}_${idx}`,
          workflow_id: id,
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

    // Save conditions (IF rules)
    if (body.conditions && Array.isArray(body.conditions)) {
      dbRepo.conditions = dbRepo.conditions.filter(c => c.workflow_id !== id);
      body.conditions.forEach((c: any, idx: number) => {
        dbRepo.conditions.push({
          id: c.id || `cond_${Date.now()}_${idx}`,
          workflow_id: id,
          field_name: c.field_name,
          operator: c.operator || 'equals',
          comparison_value: c.comparison_value || '',
          action_config: c.action_config || { set_priority: 'high' },
          created_at: new Date().toISOString(),
        });
      });
    }

    // Save workflow actions (post-collection actions)
    if (body.actions && Array.isArray(body.actions)) {
      dbRepo.actions = dbRepo.actions.filter(a => a.workflow_id !== id);
      body.actions.forEach((a: any, idx: number) => {
        dbRepo.actions.push({
          id: a.id || `act_${Date.now()}_${idx}`,
          workflow_id: id,
          action_type: a.action_type || 'create_customer_enquiry',
          configuration: a.configuration || {},
          order_index: idx + 1,
          enabled: a.enabled !== false,
        });
      });
    }

    const updated = dbRepo.getWorkflowWithDetails(id);
    return NextResponse.json({ success: true, workflow: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
