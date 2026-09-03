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

    const updated = dbRepo.getWorkflowWithDetails(id);
    return NextResponse.json({ success: true, workflow: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
