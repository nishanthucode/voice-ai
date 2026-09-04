'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GitFork, 
  Bot, 
  PhoneCall, 
  CalendarCheck, 
  Plug, 
  Building2, 
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

interface SidebarProps {
  businesses: any[];
  selectedBusinessId: string;
  onSelectBusiness: (id: string) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({ businesses, selectedBusinessId, onSelectBusiness, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'SaaS Landing Page', href: '/', icon: Building2 },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Workflow Builder', href: '/workflows', icon: GitFork },
    { name: 'AI Text & Voice Simulator', href: '/simulator', icon: Bot },
    { name: 'Integrations & OAuth', href: '/integrations', icon: Plug },
  ];

  const currentBiz = businesses.find(b => b.id === selectedBusinessId) || businesses[0];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30" 
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} select-none`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white glow-indigo shadow-lg">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100 tracking-wide text-lg">Aura Voice</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
                  AI PLATFORM
                </span>
              </div>
              <p className="text-xs text-slate-400">Missed-Call AI Receptionist</p>
            </div>
          </div>
          
          {setMobileMenuOpen && (
            <button 
              className="md:hidden p-1 text-slate-400 hover:text-slate-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

      {/* Multi-Tenant Business Selector */}
      <div className="p-4 border-b border-slate-800/60 bg-slate-950/40">
        <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1.5 block">
          Active Business Tenant
        </label>
        <div className="relative">
          <select
            value={selectedBusinessId}
            onChange={(e) => onSelectBusiness(e.target.value)}
            suppressHydrationWarning
            className="w-full appearance-none bg-slate-800/80 border border-slate-700/80 text-slate-200 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
        {currentBiz && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{currentBiz.business_type}</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Core Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 glow-indigo'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Live Demo Banner */}
      <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-300">Generic Workflow Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Switch businesses to test Cake Shop or Real Estate workflows with Gemini 3 tool calling.
        </p>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>System Online</span>
        </div>
        <span className="text-[10px] text-slate-500">v1.0.0 MVP</span>
      </div>
    </aside>
    </>
  );
}
