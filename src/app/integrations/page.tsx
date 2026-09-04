'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { 
  Calendar, 
  Phone, 
  Mic, 
  Volume2, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Settings2,
  PhoneCall,
  Sparkles,
  Lock
} from 'lucide-react';

export default function IntegrationsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('biz_bakery_01');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDevDetails, setShowDevDetails] = useState(false);
  const [autoCallbackEnabled, setAutoCallbackEnabled] = useState(true);

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
  }, []);

  const currentBiz = businesses.find(b => b.id === selectedBusinessId) || businesses[0];
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const webhookUrl = `${appUrl}/api/webhooks/telnyx`;

  const handleConnectCalendar = async () => {
    try {
      const res = await fetch(`/api/calendar/auth-url?business_id=${selectedBusinessId}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    }
  };

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

        <main className="p-6 space-y-6 flex-1 overflow-y-auto max-w-6xl mx-auto w-full">
          {/* Business Owner Header Banner */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5" /> Business Owner Channel Hub
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Integrations & AI Voice Settings
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Manage your connected Google Calendar, missed call phone handling, and AI receptionist voice preferences for <strong className="text-indigo-300">{currentBiz?.name}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Calendar Card for Business Owner */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">Google Calendar Sync</h3>
                      <p className="text-xs text-slate-400">Automated Appointment Booking</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Allows your AI receptionist to check open calendar slots and automatically schedule customer appointments when a call is handled.
                </p>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Connected Google Account:</span>
                    <strong className="text-slate-200">owner@{currentBiz?.name?.toLowerCase().replace(/[^a-z]/g, '') || 'business'}.com</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Target Calendar:</span>
                    <strong className="text-indigo-400 font-medium">Primary Calendar</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConnectCalendar}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Reconnect Google Calendar</span>
              </button>
            </div>

            {/* Business Phone Line & Missed Call Handling */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">Business Phone Line</h3>
                      <p className="text-xs text-slate-400">Missed Call AI Assistant</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Business Phone Number:</span>
                    <strong className="text-indigo-300 font-mono text-sm">{currentBiz?.phone_number || '+1 (555) 234-5678'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Assigned AI Workflow:</span>
                    <strong className="text-slate-200">Missed Call Receptionist</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Automatic AI Callback</p>
                    <p className="text-[11px] text-slate-400">Instantly call back customers on missed calls</p>
                  </div>
                  <button
                    onClick={() => setAutoCallbackEnabled(!autoCallbackEnabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${autoCallbackEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoCallbackEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Calls are handled automatically using your configured workflow rules!</span>
              </div>
            </div>
          </div>

          {/* Optional Collapsible Developer Section for System Admins */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mt-6">
            <button
              onClick={() => setShowDevDetails(!showDevDetails)}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-900/40 hover:bg-slate-900/80 transition-colors text-left focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-300">Technical Developer & Webhook Configuration</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded">Admin Only</span>
              </div>
              {showDevDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showDevDetails && (
              <div className="p-6 border-t border-slate-800/80 space-y-4 bg-slate-950/60 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Telnyx Webhook Target URL</label>
                  <div className="flex items-center gap-2 max-w-xl">
                    <input
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="flex-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono rounded-xl px-3.5 py-2.5 select-all focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(webhookUrl);
                        setCopiedWebhook(true);
                        setTimeout(() => setCopiedWebhook(false), 2500);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl text-xs border border-slate-700 transition-all shrink-0"
                    >
                      {copiedWebhook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-slate-200">Speech-to-Text (STT)</p>
                    <p className="text-[11px] text-slate-400">Deepgram Nova-2 Multilingual Engine</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-slate-200">Text-to-Speech (TTS)</p>
                    <p className="text-[11px] text-slate-400">ElevenLabs Conversational Speech Synthesis</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
