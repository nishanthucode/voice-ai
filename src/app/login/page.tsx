'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneCall, Lock, Mail, ArrowRight, Sparkles, Key, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@auravoice.ai');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (data.success) {
        // Redirect to dashboard or landing page on success
        router.push('/dashboard');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickDemoLogin = () => {
    setEmail('demo@auravoice.ai');
    setPassword('demo123');
    executeLogin('demo@auravoice.ai', 'demo123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -top-32 -left-32" />
      <div className="absolute w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none -bottom-32 -right-32" />

      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-800 space-y-6 relative z-10 shadow-2xl">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white mx-auto shadow-lg glow-indigo">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Aura Voice Platform</h1>
          <p className="text-xs text-slate-400">AI Voice Receptionist SaaS Portal</p>
        </div>

        {/* Prominent Hardcoded Demo Credentials Banner */}
        <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-indigo-300">
            <span className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-400" />
              Hardcoded Demo Credentials
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] rounded-full font-bold">
              Ready to Use
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <strong className="text-slate-200">demo@auravoice.ai</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Password:</span>
              <strong className="text-indigo-400">demo123</strong>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@auravoice.ai"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Regular Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl text-sm shadow-lg glow-indigo transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Instant Demo Login Button */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-medium py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 focus:outline-none"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>1-Click Instant Demo Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
