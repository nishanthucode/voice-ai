'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, RotateCcw, Calendar, CheckCircle2, ShieldCheck, User, Menu } from 'lucide-react';

interface NavbarProps {
  currentBusinessName?: string;
  onResetSeed?: () => void;
  onMenuToggle?: () => void;
}

export function Navbar({ currentBusinessName = 'Sweet Moments Bakery', onResetSeed, onMenuToggle }: NavbarProps) {
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await fetch('/api/seed', { method: 'POST' });
      if (onResetSeed) onResetSeed();
      window.location.reload();
    } catch (e) {
      console.error('Seed reset failed', e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-1.5 -ml-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base font-semibold text-slate-100 hidden sm:block">
          {currentBusinessName}
        </h1>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>AI Receptionist Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Google Calendar Connected Status Badge */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-lg text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Google Calendar: <strong className="text-emerald-400 font-medium">Connected</strong></span>
        </div>

        {/* Quick Simulator Launch Button */}
        <Link
          href="/simulator"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-md glow-indigo transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Simulator</span>
        </Link>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Reset back to default demo dataset"
          aria-label="Reset Demo Data"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>Reset Demo Data</span>
        </button>

        {/* Demo User Avatar */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-3 ml-1">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
