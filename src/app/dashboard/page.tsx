'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { 
  PhoneMissed, 
  Sparkles, 
  CalendarCheck2, 
  AlertCircle, 
  Filter, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('biz_bakery_01');
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [triggeringCall, setTriggeringCall] = useState(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBusinesses = async () => {
    try {
      const res = await fetch('/api/businesses');
      const data = await res.json();
      if (data.businesses) {
        setBusinesses(data.businesses);
        if (data.businesses.length > 0 && !selectedBusinessId) {
          setSelectedBusinessId(data.businesses[0].id);
        }
      }
    } catch (e) {
      console.error('Fetch businesses failed', e);
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      let url = `/api/conversations?business_id=${selectedBusinessId}`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      if (priorityFilter !== 'ALL') url += `&priority=${priorityFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch (e) {
      console.error('Fetch conversations failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchConversations();
    }
  }, [selectedBusinessId, statusFilter, priorityFilter]);

  const handleUpdateStatus = async (convId: string, newStatus: string) => {
    setUpdatingId(convId);
    try {
      await fetch(`/api/conversations/${convId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_up_status: newStatus }),
      });
      fetchConversations();
      showToast(`Status updated to ${newStatus}`);
    } catch (e) {
      console.error('Update status failed', e);
      showToast('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const handleSimulateCallback = async () => {
    // We'll prompt the user for their phone number so the AI can call them back
    const phone = window.prompt("Enter your verified Twilio phone number to receive the AI callback (e.g., +14053577940):", "+1");
    if (!phone) return;

    setTriggeringCall(true);
    showToast(`Initiating callback to ${phone}...`);
    
    try {
      const res = await fetch('/api/voice/call-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhone: phone,
          businessId: selectedBusinessId,
          workflowId: 'wf_cake_order_01'
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      showToast('AI is calling you now! Please answer your phone.');
      setTimeout(fetchConversations, 5000); // refresh feed after a bit
    } catch (e: any) {
      console.error(e);
      showToast(`Failed to call: ${e.message}`);
    } finally {
      setTriggeringCall(false);
    }
  };

  const currentBusiness = businesses.find(b => b.id === selectedBusinessId);

  const filteredConversations = conversations.filter(item => {
    const c = item.conversation;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.caller_name?.toLowerCase().includes(q) ||
      c.intent?.toLowerCase().includes(q) ||
      c.phone_number?.includes(q) ||
      c.summary?.toLowerCase().includes(q)
    );
  });

  const totalCalls = conversations.length;
  const urgentCalls = conversations.filter(c => c.conversation.priority === 'urgent').length;
  const bookingsCount = conversations.filter(c => c.toolCalls?.some((t: any) => t.tool_name === 'create_calendar_event')).length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        businesses={businesses}
        selectedBusinessId={selectedBusinessId}
        onSelectBusiness={(id) => setSelectedBusinessId(id)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Global Toast */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 bg-slate-800 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar 
          currentBusinessName={currentBusiness?.name} 
          onResetSeed={fetchConversations} 
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Multi-Tenant Dashboard
                </span>
                <span className="text-xs text-slate-400">Timezone: {currentBusiness?.timezone || 'UTC'}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Missed Call AI Assistant Feed
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Automated AI callbacks, captured lead attributes, Google Calendar events, and interaction audit trails for <strong className="text-indigo-400">{currentBusiness?.name}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleSimulateCallback}
                disabled={triggeringCall}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <PhoneMissed className={`w-4 h-4 ${triggeringCall ? 'animate-pulse' : ''}`} />
                <span>{triggeringCall ? 'Calling...' : 'Trigger AI Callback'}</span>
              </button>
              <button
                onClick={fetchConversations}
                aria-label="Refresh Data"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>



          {/* Search & Filter Toolbar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                aria-label="Search conversations"
                placeholder="Search by caller name, phone number, intent, summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                <span>Priority:</span>
              </div>
              <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
                {['ALL', 'normal', 'high', 'urgent'].map((p) => (
                  <button
                    key={p}
                    aria-label={`Filter by priority ${p}`}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      priorityFilter === p
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversations Table Feed */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <h3 className="font-semibold text-slate-200 text-base">Conversations Feed & Audit Log</h3>
              <span className="text-xs text-slate-400">Showing {filteredConversations.length} records</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <PhoneMissed className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">No conversations found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Run a simulated call using the button above to generate interaction records!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {filteredConversations.map((item) => {
                  const c = item.conversation;
                  const fields = item.fields || [];
                  const toolCalls = item.toolCalls || [];
                  const messages = item.messages || [];

                  return (
                    <div key={c.id} className="p-6 bg-slate-900/20 hover:bg-slate-900/60 transition-all flex flex-col gap-4 border-b border-slate-800/50 last:border-0">
                      
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        {/* Left: Caller Info & Intent */}
                        <div className="space-y-3 max-w-xl">
                          {/* Business & Workflow Used */}
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                            <span>{item.business?.name || 'Unknown Business'}</span>
                            <span className="text-slate-600">•</span>
                            <span>{item.workflow?.name || 'Unknown Workflow'}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-extrabold text-slate-100 text-lg">{c.caller_name || 'Guest Caller'}</span>
                            <span className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                              {c.phone_number}
                            </span>
                          
                            {/* Priority Badge */}
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase tracking-wider ${
                              c.priority === 'urgent'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                                : c.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {c.priority}
                            </span>

                            <span className="px-2 py-0.5 text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">
                              {c.intent || 'General Inquiry'}
                            </span>

                            {/* Conversation Status */}
                            <span className={`px-2 py-0.5 text-[11px] font-medium border rounded ${
                              c.status === 'COMPLETED' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {c.status || 'ACTIVE'}
                            </span>
                          </div>

                          {/* AI Summary */}
                          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                            {c.summary || 'No summary available.'}
                          </p>

                          {/* Extracted Fields Chips */}
                          {fields.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] font-medium text-slate-400">Captured:</span>
                              {fields.map((f: any) => (
                                <span key={f.id} className="px-2 py-0.5 text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/60 rounded-md">
                                  <strong className="text-indigo-400 font-medium">{f.field_name}:</strong> {String(f.value)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right: Actions, Tools & Follow-up Controls */}
                        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{new Date(c.started_at).toLocaleString()}</span>
                          </div>

                          {/* Executed Tools Badge */}
                          {toolCalls.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-lg">
                              <CalendarCheck2 className="w-3.5 h-3.5" />
                              <span>Actions: {toolCalls.map((t: any) => t.tool_name).join(', ')}</span>
                            </div>
                          )}

                          {/* Status Toggle buttons */}
                          <div className="flex items-center gap-2 mt-2">
                            {updatingId === c.id ? (
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                                <span>Updating...</span>
                              </div>
                            ) : (
                              <>
                                <label className="text-[11px] text-slate-400">Follow-up Status:</label>
                                <select
                                  aria-label="Update follow-up status"
                                  value={c.follow_up_status || 'pending'}
                                  onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="completed">Completed</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Full Transcript Section (Toggleable via Details/Accordion in a real app, but shown directly or wrapped in details tag) */}
                      <details className="mt-2 group">
                        <summary className="text-xs font-semibold text-indigo-400 cursor-pointer hover:text-indigo-300 select-none flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1 w-fit">
                          <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                          View Transcript
                        </summary>
                        <div className="mt-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 max-h-64 overflow-y-auto space-y-3">
                          {messages.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No transcript available.</p>
                          ) : (
                            messages.map((msg: any) => (
                              <div key={msg.id} className="flex flex-col gap-1">
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {msg.role === 'assistant' ? 'AI Receptionist' : 'Customer'} • {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                                <p className={`text-xs p-2.5 rounded-lg ${msg.role === 'assistant' ? 'bg-slate-900 text-slate-200' : 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/20'}`}>
                                  {msg.content}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
