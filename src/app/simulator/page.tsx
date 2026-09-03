'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { 
  Send, 
  RotateCcw, 
  Globe, 
  PhoneCall, 
  Mic, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Terminal, 
  CalendarCheck, 
  AlertCircle, 
  Layers, 
  Cpu, 
  Zap,
  Play,
  Pause
} from 'lucide-react';

export default function SimulatorPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('biz_bakery_01');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf_cake_order_01');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Conversation state
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug Panel state
  const [extractedFields, setExtractedFields] = useState<Record<string, any>>({});
  const [evaluatedConditions, setEvaluatedConditions] = useState<any[]>([]);
  const [toolCalls, setToolCalls] = useState<any[]>([]);
  const [priority, setPriority] = useState<string>('normal');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Audio speech synthesis state for phone call simulation
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // UI state
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({
    fields: true,
    tools: false,
    conditions: false
  });
  
  const togglePanel = (panel: string) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
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

  const fetchWorkflows = async () => {
    try {
      const res = await fetch(`/api/workflows?business_id=${selectedBusinessId}`);
      const data = await res.json();
      if (data.workflows && data.workflows.length > 0) {
        setWorkflows(data.workflows);
        setSelectedWorkflowId(data.workflows[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchWorkflows();
      handleResetConversation();
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleResetConversation = () => {
    setConversationId(null);
    setMessages([]);
    setExtractedFields({});
    setEvaluatedConditions([]);
    setToolCalls([]);
    setPriority('normal');
    setIsCompleted(false);

    const activeWf = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];
    if (activeWf) {
      const initialGreeting = language === 'hi'
        ? `नमस्ते! ${activeWf.greeting}`
        : activeWf.greeting;
      
      setMessages([{ role: 'assistant', content: initialGreeting, timestamp: new Date().toISOString() }]);
    }
  };

  const speakText = async (text: string) => {
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          voiceId: language === 'hi' ? 'eleven_multilingual_v2_hindi' : '21m00Tcm4TlvDq8ikWAM' 
        }),
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error('TTS error', e);
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Append user message immediately
    const userMsg = { role: 'user', content: userText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/simulator/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          business_id: selectedBusinessId,
          workflow_id: selectedWorkflowId,
          user_message: userText,
          language,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConversationId(data.conversationId);
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() },
        ]);

        if (data.extractedFields) setExtractedFields(data.extractedFields);
        if (data.conditionsEvaluated) setEvaluatedConditions(data.conditionsEvaluated);
        if (data.toolCallsExecuted) setToolCalls(prev => [...prev, ...data.toolCallsExecuted]);
        if (data.priority) setPriority(data.priority);
        if (data.isCompleted !== undefined) setIsCompleted(data.isCompleted);

        // Speak assistant response for voice call feel!
        speakText(data.reply);
      }
    } catch (e) {
      console.error('Simulator message send error', e);
    } finally {
      setLoading(false);
    }
  };

  const currentBiz = businesses.find(b => b.id === selectedBusinessId);
  const currentWf = workflows.find(w => w.id === selectedWorkflowId);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        businesses={businesses}
        selectedBusinessId={selectedBusinessId}
        onSelectBusiness={(id) => setSelectedBusinessId(id)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar 
          currentBusinessName={currentBiz?.name} 
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header Controls Banner */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" /> Live Phone Simulation Surface
                </span>
                <span className="text-xs text-slate-400">Gemini 3 Function Calling Engine</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Interactive Text & Voice AI Simulator
              </h2>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-900 border border-slate-700 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    language === 'en'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3 h-3" /> English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    language === 'hi'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3 h-3 text-orange-400" /> Hindi (हिंदी)
                </button>
              </div>

              {/* Workflow Selector */}
              <select
                aria-label="Select Workflow"
                value={selectedWorkflowId}
                onChange={(e) => {
                  setSelectedWorkflowId(e.target.value);
                  handleResetConversation();
                }}
                className="bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {workflows.map((w) => (
                  <option key={w.id} value={w.id}>
                    Workflow: {w.name}
                  </option>
                ))}
              </select>

              {/* Reset Conversation */}
              <button
                onClick={handleResetConversation}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Session</span>
              </button>
            </div>
          </div>

          {/* Dual Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Phone Call Chat Surface (7 cols) */}
            <div className="lg:col-span-7 glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[600px] lg:h-[640px]">
              {/* Phone Header Bar */}
              <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      AI
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-slate-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{currentBiz?.name} Receptionist</h3>
                    <p className="text-[11px] text-indigo-400">
                      {isSpeaking ? 'Voice Assistant Speaking...' : 'Connected • Active Voice Call'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSpeaking && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[11px] font-medium animate-pulse">
                      <Volume2 className="w-3 h-3" />
                      <span>Audio Active</span>
                    </div>
                  )}

                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border uppercase ${
                    priority === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                      : priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    Priority: {priority}
                  </span>
                </div>
              </div>

              {/* Chat Timeline Scroll */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-slate-950/50">
                {messages.map((msg, idx) => {
                  const isAssistant = msg.role === 'assistant';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-slate-400">
                          {isAssistant ? 'Aura Voice AI' : 'Caller'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isAssistant && (
                          <button
                            onClick={() => speakText(msg.content)}
                            className="text-slate-400 hover:text-indigo-400 p-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                            title="Replay Audio"
                            aria-label={`Replay message: ${msg.content.substring(0, 20)}...`}
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                          isAssistant
                            ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none shadow-md'
                            : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-lg glow-indigo'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex flex-col items-start">
                    <div className="bg-slate-900 border border-slate-800 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                      <span>Gemini AI processing turn & dynamic fields...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  aria-label="Message Input"
                  placeholder={language === 'hi' ? 'यहाँ अपना संदेश लिखें...' : 'Type caller response (e.g. "I want a 2kg Belgian chocolate cake for tomorrow 3pm")...'}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  aria-label="Send Message"
                  disabled={!inputMessage.trim() || loading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-lg glow-indigo transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right: Developer & Audit Debug Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-slate-200 text-sm">Developer Audit Debug Panel</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                    LIVE INSPECTOR
                  </span>
                </div>

                {/* Workflow Completion Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Workflow Completion</span>
                    <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {isCompleted ? 'Completed 100%' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-amber-500'}`}
                      style={{ width: isCompleted ? '100%' : '60%' }}
                    />
                  </div>
                </div>

                {/* Extracted Dynamic Fields Section */}
                <div className="space-y-2">
                  <button 
                    onClick={() => togglePanel('fields')}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-slate-100 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Captured Dynamic Fields</span>
                    </div>
                    <span className="text-slate-500">{expandedPanels.fields ? '−' : '+'}</span>
                  </button>

                  {expandedPanels.fields && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      {Object.keys(extractedFields).length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No fields extracted yet.</p>
                      ) : (
                        Object.entries(extractedFields).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between text-xs border-b border-slate-900 pb-1 last:border-0">
                            <span className="font-mono text-indigo-400">{k}:</span>
                            <span className="font-medium text-slate-200">{JSON.stringify(v)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Google Calendar & Executed Tool Calls */}
                <div className="space-y-2">
                  <button 
                    onClick={() => togglePanel('tools')}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-slate-100 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tool Calls Audit Log</span>
                    </div>
                    <span className="text-slate-500">{expandedPanels.tools ? '−' : '+'}</span>
                  </button>

                  {expandedPanels.tools && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 max-h-44 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      {toolCalls.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No tools executed yet in this session.</p>
                      ) : (
                        toolCalls.map((tc, idx) => (
                          <div key={idx} className="p-2 bg-slate-900 rounded-lg border border-slate-800 space-y-1 text-xs">
                            <div className="flex items-center justify-between font-mono font-bold text-emerald-400">
                              <span>{tc.name}</span>
                              <span className="text-[10px] text-slate-400">SUCCESS</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono truncate">
                              Args: {JSON.stringify(tc.args)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Evaluated Conditions Audit */}
                <div className="space-y-2">
                  <button 
                    onClick={() => togglePanel('conditions')}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-slate-100 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Evaluated Conditions</span>
                    </div>
                    <span className="text-slate-500">{expandedPanels.conditions ? '−' : '+'}</span>
                  </button>

                  {expandedPanels.conditions && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 max-h-36 overflow-y-auto text-xs animate-in fade-in slide-in-from-top-2">
                      {evaluatedConditions.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No rule conditions triggered yet.</p>
                      ) : (
                        evaluatedConditions.map((c, idx) => (
                          <div key={idx} className={`p-2 rounded-lg border ${c.matched ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                            <div className="flex items-center justify-between font-medium">
                              <span>IF {c.fieldName} {c.operator} {c.comparisonValue}</span>
                              <span className="font-bold">{c.matched ? 'MATCHED' : 'FALSE'}</span>
                            </div>
                            {c.matched && c.customMessage && (
                              <p className="text-[11px] mt-0.5 text-amber-200">{c.customMessage}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
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
