"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import {
  Sparkles,
  ArrowRight,
  Bot,
  Terminal,
  Code2,
  Cpu,
  Zap,
  Shield,
  Star,
  CheckCircle2,
  PlayCircle,
  Layers,
  FileCode2,
  Check,
} from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState("Algorithms");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sampleQuestions = {
    Algorithms: [
      {
        title: "LRU Cache Implementation",
        desc: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put.",
        lang: "TypeScript",
        diff: "Medium",
      },
      {
        title: "Binary Tree Maximum Path Sum",
        desc: "Given the root of a binary tree, return the maximum path sum of any non-empty path across nodes.",
        lang: "Python",
        diff: "Hard",
      },
      {
        title: "Merge K Sorted Linked Lists",
        desc: "Merge k sorted linked lists and return it as one sorted list. Analyze the time & space complexity.",
        lang: "Java",
        diff: "Hard",
      },
    ],
    Frontend: [
      {
        title: "React Concurrent Mode & Transitions",
        desc: "Explain how React 18 useTransition and useDeferredValue interrupt rendering to keep the main thread responsive.",
        lang: "JavaScript",
        diff: "Senior",
      },
      {
        title: "Custom Hook for Debounced API Search",
        desc: "Implement a production-grade useDebounce hook with cleanup, cancellation, and TypeScript generics.",
        lang: "TypeScript",
        diff: "Medium",
      },
      {
        title: "Core Web Vitals Optimization",
        desc: "Diagnose and fix CLS (Cumulative Layout Shift) and INP (Interaction to Next Paint) in dynamic SSR apps.",
        lang: "Architecture",
        diff: "Senior",
      },
    ],
    "Full Stack & Backend": [
      {
        title: "Idempotent Payment Webhook Handler",
        desc: "Design a bulletproof webhook consumer that handles duplicate deliveries and race conditions.",
        lang: "Node.js",
        diff: "Senior",
      },
      {
        title: "Distributed Rate Limiter",
        desc: "Implement a token-bucket or sliding-window rate limiter using Redis and atomic Lua scripts.",
        lang: "Go",
        diff: "Hard",
      },
      {
        title: "PostgreSQL Index Optimization",
        desc: "Analyze B-Tree vs GIN indexes for JSONB queries and explain query execution plans with EXPLAIN ANALYZE.",
        lang: "SQL",
        diff: "Senior",
      },
    ],
    "System Design": [
      {
        title: "Real-Time Collaborative Canvas (Figma)",
        desc: "Architect a Conflict-Free Replicated Data Type (CRDT) synchronization engine with WebSockets.",
        lang: "System",
        diff: "Staff",
      },
      {
        title: "Global Video Streaming Pipeline (Netflix)",
        desc: "Design multi-bitrate HLS transcoding, CDN edge caching, and fault-tolerant storage at scale.",
        lang: "Cloud",
        diff: "Staff",
      },
      {
        title: "High-Throughput Notification Engine",
        desc: "Design an event-driven notification broker processing 200k messages/sec with priority tiers.",
        lang: "Kafka",
        diff: "Senior",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/20 selection:text-cyan-400 relative w-full">
      {/* 3D Visual Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-40 dark:opacity-30 pointer-events-none scale-100 transition-all duration-700"
        style={{ backgroundImage: "url('/landing-bg.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-[#090d16]/80 to-[#090d16] pointer-events-none" />

      {/* Background Ambient Glow Orbs */}
      <div className="ambient-glow bg-cyan-500/20 w-72 sm:w-[550px] h-72 sm:h-[550px] -top-20 -left-20" />
      <div className="ambient-glow bg-indigo-500/20 w-72 sm:w-[600px] h-72 sm:h-[600px] top-1/4 -right-20" />
      <div className="ambient-glow bg-purple-500/15 w-72 sm:w-[650px] h-72 sm:h-[650px] -bottom-20 left-1/3" />

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Dynamic Island Floating Header */}
      <div className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 pointer-events-none flex justify-center">
        <header className="pointer-events-auto max-w-5xl w-full dynamic-island rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2.5 transition-all duration-300">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-all">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base tracking-wider text-slate-900 dark:text-white">
                  PREP<span className="text-cyan-500 dark:text-cyan-400">-AI</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
              </div>
            </Link>

            {/* Center Navigation Pills (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/10 backdrop-blur-md">
              <Link href="/dashboard/leetcode" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 transition">
                LeetCode Arena
              </Link>
              <Link href="/dashboard/courses" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 transition">
                Placement Tracks
              </Link>
              <a href="#demo" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 transition">
                Challenges
              </a>
              <a href="#features" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 transition">
                Capabilities
              </a>
            </nav>

            {/* Right Action Capsule */}
            <div className="flex items-center gap-2 shrink-0">
              <ModeToggle />
              
              <SignedOut>
                <div className="hidden sm:flex items-center gap-1.5">
                  <SignInButton mode="modal">
                    <button className="text-xs font-bold px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-cyan-400 transition">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20 hover:opacity-90 transition">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Launch</span> Studio
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">✕</div>
                ) : (
                  <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
                    <span className="w-4 h-0.5 bg-current rounded-full" />
                    <span className="w-4 h-0.5 bg-current rounded-full" />
                    <span className="w-4 h-0.5 bg-current rounded-full" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Dynamic Island Expandable Mobile Tray */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/dashboard/leetcode"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/10 glass-card"
                >
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>LeetCode Arena</span>
                </Link>
                <Link
                  href="/dashboard/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/10 glass-card"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Courses &amp; Tracks</span>
                </Link>
                <a
                  href="#demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/10 glass-card"
                >
                  <PlayCircle className="w-4 h-4 text-amber-400" />
                  <span>Challenges</span>
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/10 glass-card"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Features</span>
                </a>
              </div>

              <SignedOut>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/40 dark:border-white/5">
                  <SignInButton mode="modal">
                    <button className="w-full py-2 rounded-xl text-xs font-bold glass-card text-slate-700 dark:text-slate-200">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          )}
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-[11px] sm:text-xs font-bold text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 dark:border-cyan-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI-Driven Technical Assessment Studio</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white break-words">
              Ace Technical Interviews With <span className="text-gradient">PREP-AI</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Generate custom coding challenges and architectural questions for your target stack. Type code or written solutions directly in the studio for instant Big-O analysis, feedback, and scoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-black text-sm shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2.5 group"
              >
                <span>Start Practice Session</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-card font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-white/10 transition flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200"
              >
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                <span>Explore Challenges</span>
              </a>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-5 border-t border-slate-200/60 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-2.5 rounded-xl glass-card text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-cyan-400 block">10,000+</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Sessions Solved</span>
              </div>
              <div className="p-2.5 rounded-xl glass-card text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-cyan-400 block">100%</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Zero Camera</span>
              </div>
              <div className="p-2.5 rounded-xl glass-card text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-cyan-400 block">8+</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Languages</span>
              </div>
              <div className="p-2.5 rounded-xl glass-card text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-cyan-400 block">&lt; 1.5s</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Fast Feedback</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse" />
            <div className="relative glass-panel rounded-3xl p-3 sm:p-4 border border-white/60 dark:border-white/20 shadow-2xl overflow-hidden group">
              <img
                src="/landing-bg.png"
                alt="PREP-AI Interactive Studio"
                className="w-full h-auto rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card backdrop-blur-xl border border-white/30 dark:border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">PREP-AI Companion</span>
                    <span className="text-[10px] text-slate-300">Code &amp; Concept Evaluator</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Code Evaluation Mockup Preview */}
        <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-3xl blur-2xl opacity-25" />
          <div className="relative glass-panel rounded-3xl border border-white/50 dark:border-white/10 p-4 sm:p-8 shadow-2xl overflow-hidden">
            {/* Terminal Topbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                  prep_session_01 • TypeScript Solution
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] sm:text-xs font-bold border border-cyan-500/20 self-start sm:self-auto">
                <Cpu className="w-3 h-3" />
                PREP-AI Engine Active
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
              {/* Code Workspace Side */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-500/20">
                    Challenge #03 • LRU Cache
                  </div>
                  <h3 className="text-sm sm:text-base font-bold leading-snug text-slate-900 dark:text-white">
                    Implement an LRU Cache with O(1) time complexity for both get() and put() operations.
                  </h3>
                </div>

                {/* Code Block */}
                <div className="rounded-xl glass-terminal p-3 sm:p-4 font-mono text-[11px] sm:text-xs text-slate-200 space-y-1 overflow-x-auto">
                  <p className="text-slate-500">// Candidate Implementation</p>
                  <p><span className="text-purple-400">class</span> <span className="text-yellow-300">LRUCache</span> &#123;</p>
                  <p className="pl-3 sm:pl-4"><span className="text-blue-400">private</span> map = <span className="text-purple-400">new</span> <span className="text-yellow-300">Map</span>();</p>
                  <p className="pl-3 sm:pl-4"><span className="text-blue-400">constructor</span>(<span className="text-blue-400">private</span> capacity: <span className="text-cyan-400">number</span>) &#123;&#125;</p>
                  <p className="pl-3 sm:pl-4"><span className="text-green-400">get</span>(key: <span className="text-cyan-400">number</span>) &#123;</p>
                  <p className="pl-6 sm:pl-8"><span className="text-purple-400">if</span> (!<span className="text-blue-400">this</span>.map.has(key)) <span className="text-purple-400">return</span> -1;</p>
                  <p className="pl-6 sm:pl-8"><span className="text-blue-400">const</span> val = <span className="text-blue-400">this</span>.map.get(key);</p>
                  <p className="pl-6 sm:pl-8"><span className="text-blue-400">this</span>.map.delete(key); <span className="text-blue-400">this</span>.map.set(key, val);</p>
                  <p className="pl-6 sm:pl-8"><span className="text-purple-400">return</span> val;</p>
                  <p className="pl-3 sm:pl-4">&#125;</p>
                  <p>&#125;</p>
                </div>
              </div>

              {/* Feedback Side */}
              <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl glass-card border border-indigo-500/30 dark:border-cyan-500/20 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-indigo-600 dark:text-cyan-400">
                      PREP-AI Analysis
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      Rating: 9.5 / 10
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Optimal Complexity:</strong> Map preserves insertion order with genuine O(1) ops.</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Edge Cases:</strong> Correctly handles key re-insertion and deletion order on read.</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Pro-Tip:</strong> In C++/Java, pair a Doubly Linked List with a Hash Table.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Status: Verified</span>
                  <Link href="/dashboard" className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline">
                    Next Challenge →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Role Showcase */}
      <section id="demo" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-2">
            PREP-AI CHALLENGE SUITE
          </h2>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Tailored Technical Challenges by Discipline
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-xs sm:text-sm">
            Explore sample challenges synthesized by PREP-AI for software engineering candidates.
          </p>
        </div>

        {/* Role Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:justify-center mb-8">
          {Object.keys(sampleQuestions).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-4 py-2 rounded-xl sm:rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
                activeRole === role
                  ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 scale-105"
                  : "glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Question Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sampleQuestions[activeRole].map((q, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative group border border-slate-200/80 dark:border-white/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20">
                    0{idx + 1}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300">
                    {q.lang} • {q.diff}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug mb-2">
                  {q.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {q.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">PREP-AI Ready</span>
                <Link
                  href="/dashboard"
                  className="font-bold text-indigo-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                >
                  Solve Challenge →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-2">
            CORE CAPABILITIES
          </h2>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Built for Elite Software Engineers
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80 dark:border-white/10">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">Live Code Workspace</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Type code solutions in JavaScript, Python, TypeScript, Java, C++, or Go. Clean terminal theme with tab indentation and shortcut execution.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80 dark:border-white/10">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">Gemini AI Code Evaluator</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Instant evaluation of algorithmic logic, Big-O time/space complexity, boundary edge cases, and code style.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80 dark:border-white/10">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">Zero Camera / Audio Stress</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Focus 100% on problem solving and writing clean, scalable code without intrusive webcam or microphone barriers.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5">
                <Terminal className="w-5 h-5" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">LeetCode-Style Problem Arena</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Curated Blind 75 and Top 150 questions with acceptance metrics, custom test cases, and AI Automated Judge.
              </p>
            </div>
            <Link href="/dashboard/leetcode" className="mt-4 text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1">
              Explore Arena &rarr;
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">Placement Playbooks</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Integrated YouTube tracks (Striver SDE Sheet, Gaurav Sen System Design, Gate Smashers, Web Dev Cohort) with interactive progress checklists.
              </p>
            </div>
            <Link href="/dashboard/courses" className="mt-4 text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
              View Roadmaps &rarr;
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/80 dark:border-white/10 group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">Apple Liquid Glass UI</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Floating Dynamic Island navbars, frosted backdrop blur, and responsive mobile-ready layout engineered for sleek developer UX.
              </p>
            </div>
            <span className="mt-4 text-[11px] sm:text-xs font-bold text-cyan-400 flex items-center gap-1">
              Fast &amp; Fluid • Mobile First
            </span>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 text-center border border-white/40 dark:border-white/10 shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Ready to Accelerate Your Technical Prep?
            </h3>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Join thousands of developers mastering algorithms, system design, and frontend architecture with PREP-AI.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition"
              >
                <span>Launch PREP-AI Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-slate-200/60 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="font-extrabold text-slate-800 dark:text-slate-200 tracking-wider">PREP-AI</span>
          </div>
          <p>© {new Date().getFullYear()} PREP-AI Engineering Studio. Built with Next.js &amp; Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}