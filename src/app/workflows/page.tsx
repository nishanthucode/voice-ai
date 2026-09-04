'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { 
  GitFork, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  HelpCircle, 
  Sliders, 
  Globe, 
  Calendar, 
  Zap,
  Sparkles,
  Layers
} from 'lucide-react';
import { FieldDataType, ConditionOperator, PriorityLevel } from '@/lib/db/types';

export default function WorkflowsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('biz_bakery_01');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [greeting, setGreeting] = useState('');
  const [closingMessage, setClosingMessage] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [triggerType, setTriggerType] = useState<string>('MISSED_CALL');

  // Fields State
  const [fields, setFields] = useState<any[]>([]);

  // Conditions State
  const [conditions, setConditions] = useState<any[]>([]);

  // Actions State (what happens after data collection)
  const [actions, setActions] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchBusinesses = async () => {
    try {
      const res = await fetch('/api/businesses');
      const data = await res.json();
      if (data.businesses) setBusinesses(data.businesses);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWorkflows = async () => {
    try {
      const res = await fetch(`/api/workflows?business_id=${selectedBusinessId}`);
      const data = await res.json();
      if (data.workflows) {
        setWorkflows(data.workflows);
        if (data.workflows.length > 0) {
          loadWorkflow(data.workflows[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadWorkflow = (wf: any) => {
    setSelectedWorkflow(wf);
    setIsCreating(false);
    setName(wf.name || '');
    setDescription(wf.description || '');
    setGreeting(wf.greeting || '');
    setClosingMessage(wf.closing_message || '');
    setLanguage(wf.language || 'en');
    setTriggerType(wf.trigger_type || 'MISSED_CALL');
    setFields(wf.fields || []);
    setConditions(wf.conditions || []);
    setActions(wf.actions || []);
  };

  const handleCreateNew = () => {
    setSelectedWorkflow(null);
    setIsCreating(true);
    setName('');
    setDescription('');
    setGreeting('Hello! Thank you for calling. How can I help you today?');
    setClosingMessage('Thank you for the information. We will get back to you soon!');
    setLanguage('en');
    setTriggerType('MISSED_CALL');
    setFields([]);
    setConditions([]);
    setActions([{ id: `temp_act_${Date.now()}`, action_type: 'create_customer_enquiry', configuration: {}, enabled: true }]);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchWorkflows();
    }
  }, [selectedBusinessId]);

  const handleAddField = () => {
    const newF = {
      id: `temp_f_${Date.now()}`,
      name: `field_${fields.length + 1}`,
      label: 'New Dynamic Field',
      question: 'May I know the details for this field?',
      data_type: 'string' as FieldDataType,
      required: true,
    };
    setFields([...fields, newF]);
  };

  const handleRemoveField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx: number, key: string, val: any) => {
    const updated = [...fields];
    updated[idx][key] = val;
    if (key === 'label' && !updated[idx].name_manual) {
      updated[idx].name = val.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    setFields(updated);
  };

  const handleAddCondition = () => {
    const newC = {
      id: `temp_c_${Date.now()}`,
      field_name: fields[0]?.name || 'required_date',
      operator: 'within_hours' as ConditionOperator,
      comparison_value: '24',
      action_config: { set_priority: 'urgent' as PriorityLevel },
    };
    setConditions([...conditions, newC]);
  };

  const handleRemoveCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const handleAddAction = () => {
    setActions([...actions, { id: `temp_act_${Date.now()}`, action_type: 'create_customer_enquiry', configuration: {}, enabled: true }]);
  };

  const handleRemoveAction = (idx: number) => {
    setActions(actions.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    const payload = {
      name,
      description,
      greeting,
      closing_message: closingMessage,
      language,
      trigger_type: triggerType,
      fields,
      conditions,
      actions,
      business_id: selectedBusinessId,
    };

    try {
      let res;
      if (isCreating || !selectedWorkflow) {
        // CREATE new workflow
        res = await fetch('/api/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // UPDATE existing workflow
        res = await fetch(`/api/workflows/${selectedWorkflow.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success || data.workflow) {
        setSaveSuccess(true);
        setIsCreating(false);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchWorkflows();
      }
    } catch (e) {
      console.error('Save workflow failed', e);
    } finally {
      setSaving(false);
    }
  };

  const currentBiz = businesses.find(b => b.id === selectedBusinessId);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        businesses={businesses}
        selectedBusinessId={selectedBusinessId}
        onSelectBusiness={(id) => setSelectedBusinessId(id)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          currentBusinessName={currentBiz?.name} 
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full flex items-center gap-1">
                  <GitFork className="w-3 h-3" /> Generic Workflow Engine
                </span>
                <span className="text-xs text-slate-400">Zero Hardcoded Industry Code</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Dynamic Workflow & Field Builder
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Configure AI conversation prompts, required attributes, dynamic rule conditions, and approved tool capabilities.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Workflow</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg glow-indigo transition-all disabled:opacity-50"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : (isCreating ? 'Create Workflow' : 'Save Workflow Changes')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Workflow Selector Tabs */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2">
            {workflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => loadWorkflow(wf)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedWorkflow?.id === wf.id && !isCreating
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {wf.name}
              </button>
            ))}
            {isCreating && (
              <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/40">
                + New Workflow
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: General Configuration */}
            <div className="space-y-6">
              {/* Basic Details Card */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-slate-200 text-base">Workflow Profile</h3>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Workflow Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Default Language</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        language === 'en'
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 glow-indigo'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> English (en)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('hi')}
                      className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        language === 'hi'
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 glow-indigo'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 text-orange-400" /> Hindi (हिंदी)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Trigger Type</label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="MISSED_CALL">Missed Call</option>
                    <option value="INBOUND_CALL">Inbound Call</option>
                    <option value="MANUAL_SIMULATION">Manual Simulation</option>
                  </select>
                </div>
              </div>

              {/* Prompts Card */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-slate-200 text-base">Configured Prompts</h3>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">AI Callback Greeting</label>
                  <textarea
                    rows={3}
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">AI Closing Statement</label>
                  <textarea
                    rows={3}
                    value={closingMessage}
                    onChange={(e) => setClosingMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Right Column (2 cols): Dynamic Fields & Conditions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dynamic Fields Editor */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-bold text-slate-200 text-base">Dynamic Data Fields</h3>
                    <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-300 rounded-md">{fields.length} Configured</span>
                  </div>

                  <button
                    onClick={handleAddField}
                    className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Dynamic Field</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {fields.map((f, idx) => (
                    <div key={f.id || idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            placeholder="Field Label (e.g. Cake Flavour)"
                            value={f.label}
                            onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-slate-100 text-sm font-semibold rounded-lg px-3 py-1.5 flex-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={f.required}
                              onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                              className="accent-indigo-500 w-4 h-4 rounded"
                            />
                            <span className={f.required ? 'text-indigo-400 font-semibold' : 'text-slate-500'}>
                              {f.required ? 'REQUIRED' : 'OPTIONAL'}
                            </span>
                          </label>

                          <select
                            value={f.data_type}
                            onChange={(e) => handleFieldChange(idx, 'data_type', e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none"
                          >
                            <option value="string">Text String</option>
                            <option value="number">Number</option>
                            <option value="datetime">Date & Time</option>
                            <option value="boolean">Yes / No</option>
                            <option value="enum">Dropdown Choice</option>
                          </select>

                          <button
                            onClick={() => handleRemoveField(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-all"
                            title="Delete Field"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question prompt for AI */}
                      <div>
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">
                          AI Question Prompt (What the agent asks the customer)
                        </label>
                        <input
                          type="text"
                          value={f.question}
                          onChange={(e) => handleFieldChange(idx, 'question', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Conditions Editor */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-slate-200 text-base">Workflow Rules & Priority Conditions</h3>
                  </div>

                  <button
                    onClick={handleAddCondition}
                    className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Rule Condition</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {conditions.map((c, idx) => (
                    <div key={c.id || idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <span className="font-bold text-slate-400">IF</span>
                        <select
                          value={c.field_name}
                          onChange={(e) => {
                            const updated = [...conditions];
                            updated[idx].field_name = e.target.value;
                            setConditions(updated);
                          }}
                          className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5"
                        >
                          {fields.map(f => (
                            <option key={f.name} value={f.name}>{f.label} ({f.name})</option>
                          ))}
                        </select>

                        <select
                          value={c.operator}
                          onChange={(e) => {
                            const updated = [...conditions];
                            updated[idx].operator = e.target.value;
                            setConditions(updated);
                          }}
                          className="bg-slate-950 border border-slate-700 text-amber-300 rounded-lg px-2.5 py-1.5 font-mono"
                        >
                          <option value="within_hours">is within (hours)</option>
                          <option value="equals">equals</option>
                          <option value="contains">contains</option>
                          <option value="greater_than">greater than</option>
                          <option value="less_than">less than</option>
                        </select>

                        <input
                          type="text"
                          value={c.comparison_value}
                          onChange={(e) => {
                            const updated = [...conditions];
                            updated[idx].comparison_value = e.target.value;
                            setConditions(updated);
                          }}
                          className="bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-2.5 py-1.5 w-24"
                        />

                        <span className="font-bold text-slate-400">THEN Priority =</span>
                        <select
                          value={c.action_config?.set_priority || 'urgent'}
                          onChange={(e) => {
                            const updated = [...conditions];
                            updated[idx].action_config = { ...updated[idx].action_config, set_priority: e.target.value };
                            setConditions(updated);
                          }}
                          className="bg-slate-950 border border-rose-500/40 text-rose-300 rounded-lg px-2.5 py-1.5 font-bold uppercase"
                        >
                          <option value="urgent">URGENT</option>
                          <option value="high">HIGH</option>
                          <option value="normal">NORMAL</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleRemoveCondition(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions After Collection */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-slate-200 text-base">Actions After Collection</h3>
                  </div>
                  <button
                    onClick={handleAddAction}
                    className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Action</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {actions.map((a, idx) => (
                    <div key={a.id || idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                        <select
                          value={a.action_type}
                          onChange={(e) => {
                            const updated = [...actions];
                            updated[idx].action_type = e.target.value;
                            setActions(updated);
                          }}
                          className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 flex-1"
                        >
                          <option value="create_customer_enquiry">Create Customer Enquiry</option>
                          <option value="calendar_create_event">Create Calendar Event</option>
                          <option value="calendar_check_availability">Check Calendar Availability</option>
                          <option value="update_follow_up_status">Update Follow-up Status</option>
                          <option value="set_priority">Set Priority Level</option>
                        </select>
                        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={a.enabled !== false}
                            onChange={(e) => {
                              const updated = [...actions];
                              updated[idx].enabled = e.target.checked;
                              setActions(updated);
                            }}
                            className="accent-emerald-500 w-4 h-4 rounded"
                          />
                          <span className={a.enabled !== false ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>Enabled</span>
                        </label>
                      </div>
                      <button onClick={() => handleRemoveAction(idx)} className="text-slate-500 hover:text-rose-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {actions.length === 0 && (
                    <p className="text-xs text-slate-500 italic p-3">No actions configured. Add at least one action to define what happens after data is collected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
