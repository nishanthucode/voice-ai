'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PhoneCall, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Star, 
  Zap, 
  Calendar, 
  Globe, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  Clock, 
  ChevronRight, 
  Check, 
  Menu, 
  X, 
  Send,
  Building2,
  Users,
  BarChart3,
  Bot,
  GitFork
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950 overflow-x-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="fixed w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -top-40 -left-40 z-0" />
      <div className="fixed w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none top-1/3 -right-40 z-0" />

      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-teal-400">
                <PhoneCall className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-100 tracking-tight"> Voice</span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Missed Call Receptionist</span>
            </div>
          </Link>

          {/* Menu Links in Center */}
          {/* <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a>
            <a href="#workflows" className="hover:text-teal-400 transition-colors">Workflows</a>
            <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-teal-400 transition-colors">Testimonials</a>
          </nav> */}

          {/* Primary CTA Buttons on Right */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/simulator"
              className="text-sm font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-teal-400 fill-current" />
              <span>Live Simulator</span>
            </Link>

            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-teal-500/30 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-6 space-y-4">
            {/* <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-300">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-300">How It Works</a>
            <a href="#workflows" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-300">Workflows</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-300">Pricing</a> */}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Link href="/simulator" className="w-full text-center py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-slate-200">
                Live Simulator
              </Link>
              <Link href="/dashboard" className="w-full text-center py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
                Launch Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. FULL-WIDTH HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Next-Gen Missed Call AI Receptionist
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Gemini 3 Powered</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15]">
              Turn Every Missed Call Into a <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-teal-300 bg-clip-text text-transparent">Booked Customer</span>.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-400 font-normal leading-relaxed max-w-2xl">
              Voice automatically calls back missed callers, conducts human-like conversations in <strong className="text-slate-200">English & Hindi</strong>, captures custom lead details, evaluates priority rules, and books appointments on <strong className="text-teal-400 font-semibold">Google Calendar 24/7</strong>.
            </p>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
              >
                <span>Start Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/simulator"
                className="glass-card hover:bg-slate-900/80 text-slate-200 font-semibold text-base px-7 py-4 rounded-2xl border border-slate-700/80 hover:border-teal-500/50 transition-all flex items-center justify-center gap-2.5"
              >
                <Play className="w-4 h-4 text-teal-400 fill-current" />
                <span>Test Interactive Call</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>5-Minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Zero code customization</span>
              </div>
            </div>
          </div>

          {/* Right Hero High-Fidelity Realistic Product Mockup (5 cols) */}
          <div className="lg:col-span-5 relative group">
            {/* Glowing Accent Aura */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 via-violet-600 to-teal-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />

            {/* Mockup Frame */}
            <div className="relative glass-card rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950/90">
              {/* Window Controls */}
              <div className="h-10 bg-slate-900/90 px-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">voice-dashboard.app</span>
                <span className="w-4" />
              </div>

              {/* Generated Realistic Product Mockup Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <Image
                  src="/images/hero-mockup.png"
                  alt="Aura Voice AI SaaS Dashboard Mockup"
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

            
              <div className="absolute top-14 right-4 bg-slate-900/90 backdrop-blur-md border border-teal-500/40 p-3 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-100">100% Missed Call Callback</div>
                  <div className="text-[10px] text-teal-400">AI Call Initiated in 4s</div>
                </div>
              </div>

              <div className="absolute bottom-6 left-4 bg-slate-900/90 backdrop-blur-md border border-indigo-500/40 p-3 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-100">Google Calendar Synced</div>
                  <div className="text-[10px] text-indigo-300">Appointment Booked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* <section className="py-12 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Trusted by 500+ High-Growth Local Businesses & SaaS Enterprises
          </p>

         
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 font-extrabold text-slate-300 text-sm tracking-wider">
              <Building2 className="w-5 h-5 text-indigo-400" /> SWEET MOMENTS
            </div>
            <div className="flex items-center gap-2 font-extrabold text-slate-300 text-sm tracking-wider">
              <Building2 className="w-5 h-5 text-teal-400" /> APEX REALTY
            </div>
            <div className="flex items-center gap-2 font-extrabold text-slate-300 text-sm tracking-wider">
              <Building2 className="w-5 h-5 text-violet-400" /> MEDICARE CARE
            </div>
            <div className="flex items-center gap-2 font-extrabold text-slate-300 text-sm tracking-wider">
              <Building2 className="w-5 h-5 text-indigo-400" /> URBAN EXPRESS
            </div>
            <div className="flex items-center gap-2 font-extrabold text-slate-300 text-sm tracking-wider">
              <Building2 className="w-5 h-5 text-teal-400" /> NEXTGEN LEGAL
            </div>
            <div className="flex items-center gap-2 font-extrabold text-slate-300 text-sm tracking-wider">
              <Building2 className="w-5 h-5 text-rose-400" /> REPAIR HUB
            </div>
          </div>

          <div className="max-w-3xl mx-auto glass-card p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 p-0.5 shrink-0 shadow-lg">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-slate-100 text-lg">
                SJ
              </div>
            </div>
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-200 italic font-normal leading-relaxed">
                &ldquo;Aura Voice captured $42,000 in custom bakery orders that we previously lost to unanswered calls during rush hours. The automated Google Calendar scheduling is flawless!&rdquo;
              </p>
              <div className="text-xs text-slate-400">
                <strong className="text-slate-200">Sarah Jenkins</strong> — Head Owner, Sweet Moments Bakery
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full uppercase tracking-wider">
            Engineered For High Conversion
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Everything You Need to Automate Customer Callbacks
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Built on a non-hardcoded generic architecture so any small business or SaaS agency can launch custom voice receptionist workflows in minutes.
          </p>
        </div>

        4 Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          Card 1
          <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Zero-Code Generic Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define custom dynamic data fields, required attributes, and rules for cake shops, real estate, clinics, or repair services without touching backend code.
            </p>
          </div>

          Card 2
          <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Google Calendar Tools</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native function calling lets Gemini 3 query live availability, create appointments, update bookings, and cancel slots seamlessly.
            </p>
          </div>

          Card 3
          <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Bilingual Voice (EN + HI)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conduct fluid AI voice calls in both English and Hindi with natural speech inflection, preserving selected conversation languages.
            </p>
          </div>

        Card 4
          <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Priority Lead Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated rule conditions evaluate captured fields (e.g. orders within 24 hours) and flag critical leads as URGENT for team action.
            </p>
          </div>
        </div>
      </section> */}

     
      {/* <section id="how-it-works" className="py-24 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              How Aura Voice Works
            </h2>
            <p className="text-base text-slate-400">
              Go from setup to automated lead booking in under 5 minutes.
            </p>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className="text-4xl font-extrabold text-indigo-500/40 font-mono">01</span>
              <h4 className="text-base font-bold text-slate-100">Connect Phone & Calendar</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Link your business phone number via Twilio and authorize Google Calendar with 1-click OAuth.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className="text-4xl font-extrabold text-teal-500/40 font-mono">02</span>
              <h4 className="text-base font-bold text-slate-100">Build Your Workflow</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add dynamic fields (e.g. cake flavor or budget) and customize greetings in English & Hindi.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className="text-4xl font-extrabold text-violet-500/40 font-mono">03</span>
              <h4 className="text-base font-bold text-slate-100">Instant AI Callback</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a call is missed, Aura Voice dials the customer back immediately and conducts the call.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className="text-4xl font-extrabold text-emerald-500/40 font-mono">04</span>
              <h4 className="text-base font-bold text-slate-100">Lead & Event Synced</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captured lead details appear in your dashboard and appointments are booked directly on Google Calendar.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 6. PRICING SECTION */}
      {/* <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full uppercase tracking-wider">
            Flexible SaaS Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Transparent Plans for Businesses of Any Size
          </h2>

          
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-200' : 'text-slate-400'}`}>Monthly</span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-7 bg-slate-900 border border-slate-700 rounded-full p-1 transition-colors relative"
            >
              <div className={`w-5 h-5 rounded-full bg-teal-400 shadow-md transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-slate-200' : 'text-slate-400'}`}>
              Annual <span className="px-2 py-0.5 text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full font-bold">Save 20%</span>
            </span>
          </div>
        </div>

 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
         
          <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-100">Starter Plan</h3>
              <p className="text-xs text-slate-400">Perfect for single local stores & sole proprietors.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-100">${billingCycle === 'annual' ? '39' : '49'}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Up to 200 AI Callbacks / month</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 1 Business Tenant</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Google Calendar Integration</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> English & Hindi Support</li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 transition-all block mt-6"
            >
              Get Started Free
            </Link>
          </div>

       
          <div className="glass-card p-8 rounded-3xl border-2 border-teal-500/60 space-y-6 flex flex-col justify-between relative bg-gradient-to-b from-indigo-950/50 to-slate-950 shadow-2xl glow-indigo">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-400 to-indigo-500 text-slate-950 font-extrabold text-[11px] rounded-full uppercase tracking-wider shadow-md">
              Most Popular / Recommended
            </div>
            <div className="space-y-4 pt-2">
              <h3 className="text-xl font-bold text-slate-100">Pro Business</h3>
              <p className="text-xs text-slate-300">For growing agencies & multi-location businesses.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-teal-300">${billingCycle === 'annual' ? '79' : '99'}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-200">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Up to 1,000 AI Callbacks / month</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 5 Multi-Business Tenants</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Full Google Calendar Tool Calling</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Priority Urgent Lead Alerts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Twilio Phone Number Included</li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="w-full text-center py-3.5 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg glow-indigo transition-all block mt-6"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

      
          <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-100">Enterprise Agency</h3>
              <p className="text-xs text-slate-400">Custom volume, dedicated SLA, and white-labeling.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-100">${billingCycle === 'annual' ? '199' : '249'}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Unlimited AI Callbacks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Unlimited Business Tenants</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Dedicated Pipecat Worker Nodes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> 24/7 Priority Phone & Email Support</li>
              </ul>
            </div>
            <Link
              href="/integrations"
              className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 transition-all block mt-6"
            >
              Contact Enterprise Sales
            </Link>
          </div>
        </div>
      </section> */}

      {/* 7. FINAL CTA BANNER SECTION */}
      {/* <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-10 sm:p-16 rounded-3xl border border-teal-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto border border-teal-500/30">
            <PhoneCall className="w-8 h-8 animate-bounce" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight max-w-2xl mx-auto leading-tight">
            x
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join hundreds of local businesses capturing qualified leads automatically with Aura Voice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Get Started Free Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/simulator"
              className="glass-card hover:bg-slate-900 text-slate-200 font-semibold text-sm px-6 py-4 rounded-xl border border-slate-700 transition-all"
            >
              Test Live Simulator
            </Link>
          </div>
        </div>
      </section> */}

      {/* 8. CLEAN FOOTER */}
      {/* <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-teal-400 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-teal-400">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </div>
                <span className="font-bold text-slate-100 text-base">Aura Voice</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                The generic, configuration-driven AI receptionist SaaS. Automatically call back missed callers, extract structured data, and book Google Calendar appointments.
              </p>
            </div>

            
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#features" className="hover:text-teal-400">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-teal-400">How It Works</a></li>
                <li><Link href="/workflows" className="hover:text-teal-400">Workflow Builder</Link></li>
                <li><Link href="/simulator" className="hover:text-teal-400">Live Simulator</Link></li>
              </ul>
            </div>

            
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Solutions</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/simulator" className="hover:text-teal-400">Cake Shops & Bakeries</Link></li>
                <li><Link href="/simulator" className="hover:text-teal-400">Real Estate Brokerages</Link></li>
                <li><Link href="/simulator" className="hover:text-teal-400">Clinics & Healthcare</Link></li>
                <li><Link href="/simulator" className="hover:text-teal-400">Repair Services</Link></li>
              </ul>
            </div>

            
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Newsletter</h4>
              <p className="text-xs text-slate-400">Get the latest AI receptionist updates.</p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                  <button type="submit" className="absolute right-1 top-1 bg-indigo-600 text-white p-1 rounded-lg">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {subscribed && (
                  <p className="text-[11px] text-teal-400 font-semibold">Subscribed successfully!</p>
                )}
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Aura Voice AI SaaS. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/integrations" className="hover:text-slate-300">Privacy Policy</Link>
              <Link href="/integrations" className="hover:text-slate-300">Terms of Service</Link>
              <Link href="/integrations" className="hover:text-slate-300">Security</Link>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
