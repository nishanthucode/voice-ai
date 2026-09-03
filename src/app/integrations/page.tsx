'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { 
  Plug, 
  Calendar, 
  Phone, 
  Mic, 
  Volume2, 
  Cpu, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function IntegrationsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('biz_bakery_01');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

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

  const currentBiz = businesses.find(b => b.id === selectedBusinessId);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const webhookUrl = `${appUrl}/api/calls/webhook?BusinessId=${selectedBusinessId}`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

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
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar currentBusinessName={currentBiz?.name} />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Plug className="w-3 h-3" /> External Provider Suite
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Integrations & Telephony Infrastructure
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Connect Google Calendar OAuth, Twilio webhook endpoints, Deepgram STT, ElevenLabs TTS, and Pipecat worker nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Google Calendar OAuth Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">Google Calendar Integration</h3>
                    <p className="text-xs text-slate-400">OAuth 2.0 Per Business Tenant</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Empowers the Gemini AI agent to query real-time calendar free/busy availability, schedule appointments/site visits, reschedule events, and delete cancelled calls.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Connected Account:</span>
                  <strong className="text-slate-200">sweetmoments.bakery@gmail.com</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Calendar Target:</span>
                  <strong className="text-indigo-400 font-mono">primary</strong>
                </div>
              </div>

              <button
                onClick={handleConnectCalendar}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Connect Google Account (OAuth 2.0)</span>
              </button>
            </div>

            {/* Twilio Telephony Webhook Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">Twilio Voice & Missed Calls</h3>
                    <p className="text-xs text-slate-400">Telephony Lifecycle & Webhooks</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Webhook Ready
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                When a customer calls your business number and hangs up, Twilio fires an HTTP POST webhook to trigger the AI callback queue.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Incoming Call Webhook URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono rounded-xl px-3 py-2 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyWebhook}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-xl text-xs border border-slate-700 transition-all shrink-0"
                  >
                    {copiedWebhook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Deepgram STT Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Deepgram STT (Speech-to-Text)</h3>
                  <p className="text-xs text-slate-400">Nova-2 Multilingual Engine</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                High-speed real-time audio transcription supporting English and Hindi speech streams during phone calls.
              </p>
            </div>

            {/* ElevenLabs TTS Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">ElevenLabs TTS (Text-to-Speech)</h3>
                  <p className="text-xs text-slate-400">Humanlike Voice Synthesis</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates natural, conversational speech outputs with ultra-low latency for inbound and outbound phone calls.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
