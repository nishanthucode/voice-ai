'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { 
  ArrowLeft, 
  PhoneCall, 
  CalendarCheck, 
  Clock, 
  User, 
  Layers, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      if (data.conversation) {
        setDetails(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const res = await fetch('/api/businesses');
      const data = await res.json();
      if (data.businesses) setBusinesses(data.businesses);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    if (id) fetchDetails();
  }, [id]);

  const handleUpdateStatus = async (followUpStatus: string) => {
    try {
      await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_up_status: followUpStatus }),
      });
      fetchDetails();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-300">Conversation Not Found</h2>
        <Link href="/" className="text-indigo-400 hover:underline mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const { conversation, business, workflow, fields, messages, toolCalls, calls } = details;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        businesses={businesses}
        selectedBusinessId={business?.id || 'biz_bakery_01'}
        onSelectBusiness={() => {}}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          currentBusinessName={business?.name} 
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Top Navigation Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Follow-up Status:</span>
              <select
                value={conversation.follow_up_status || 'pending'}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 font-semibold rounded-lg px-3 py-1.5 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Conversation Summary Header Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-slate-100">{conversation.caller_name || 'Guest Caller'}</h2>
                  <span className="font-mono text-sm text-indigo-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-md">
                    {conversation.phone_number}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase ${
                    conversation.priority === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {conversation.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Business: <strong className="text-slate-200">{business?.name}</strong> • Workflow: <strong className="text-indigo-400">{workflow?.name}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Recorded: {new Date(conversation.started_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Interaction Summary</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{conversation.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Messages & Transcript Timeline (7 cols) */}
            <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-400" /> Complete Call Transcript Timeline
              </h3>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {messages.map((m: any) => {
                  const isAssistant = m.role === 'assistant';
                  return (
                    <div key={m.id} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] text-slate-500 mb-1">
                        {isAssistant ? 'AI Receptionist' : 'Caller'} • {new Date(m.timestamp).toLocaleTimeString()}
                      </span>
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[88%] ${
                        isAssistant
                          ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                          : 'bg-indigo-600/30 border border-indigo-500/40 text-slate-100 rounded-tr-none'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Captured Dynamic Fields & Tool Audit (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Captured Dynamic Fields */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-200 text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" /> Structured Dynamic Fields
                </h3>

                <div className="space-y-2">
                  {fields.map((f: any) => (
                    <div key={f.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-400">{f.field_name}:</span>
                      <span className="font-bold text-indigo-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        {String(f.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Calls Audit Log */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-200 text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" /> Tool Calls Audit Trail
                </h3>

                <div className="space-y-2">
                  {toolCalls.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No tools executed during this call.</p>
                  ) : (
                    toolCalls.map((tc: any) => (
                      <div key={tc.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between font-mono font-bold text-emerald-400">
                          <span>{tc.tool_name}</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                            {tc.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Args: {JSON.stringify(tc.arguments)}
                        </p>
                      </div>
                    ))
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
