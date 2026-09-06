"use client";

import React, { useState, useEffect } from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import {
  Sparkles, Terminal, Code2, Zap, BrainCircuit, FileText,
  MessageSquare, Briefcase, ArrowRight, Trophy, CheckCircle2,
  TrendingUp, Star, Target, Flame, ShieldCheck, Layers, BookOpen
} from "lucide-react";
import Link from "next/link";

const MetricCard = ({ label, value, sublabel, icon: Icon, color = "text-cyan-400", bg = "bg-cyan-500/10" }) => (
  <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-white/10 flex items-center gap-3.5 shadow-sm">
    <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider">{label}</span>
      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{value}</span>
      {sublabel && <span className="text-[10px] text-slate-400 block">{sublabel}</span>}
    </div>
  </div>
);

const Dashboard = () => {
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const solved = JSON.parse(localStorage.getItem("prep_ai_solved_problems") || "[]");
        setSolvedCount(solved.length);
      } catch (_) {}
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Ambient background glows */}
      <div className="ambient-glow bg-cyan-500/15 w-[500px] h-[500px] -top-24 -left-24" />
      <div className="ambient-glow bg-indigo-500/15 w-[450px] h-[450px] top-1/4 -right-24" />

      {/* Hero Command Center Glass Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-white/10 p-6 sm:p-9 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 border border-indigo-500/20 dark:border-cyan-500/20 text-xs font-bold text-indigo-600 dark:text-cyan-400">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>PREP-AI INTELLIGENT CAREER PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Adaptive Mock Interviews &amp; Placement Mastery with <span className="text-gradient">PREP-AI</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Experience the only interview system that dynamically adapts difficulty (Beginner ↔ Advanced) and asks contextual follow-ups based on your exact answers, resume projects, and communication clarity.
            </p>
          </div>

          {/* Overall 360° Readiness Gauge */}
          <div className="p-5 rounded-3xl glass-card border border-cyan-500/30 shrink-0 flex items-center gap-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex flex-col items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30">
              <span>84</span>
              <span className="text-[8px] font-bold uppercase tracking-wider opacity-80">/100</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Career Readiness</span>
              <span className="text-sm font-black text-white">Placement Ready</span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">● Top 15% Candidate Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* 360° Multi-dimensional Metrics Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Technical Depth" value="86/100" sublabel="Architecture & Systems" icon={Terminal} color="text-cyan-400" bg="bg-cyan-500/10" />
        <MetricCard label="Communication" value="82/100" sublabel="STAR & Speech Clarity" icon={MessageSquare} color="text-rose-400" bg="bg-rose-500/10" />
        <MetricCard label="Coding / DSA" value={`${Math.max(solvedCount, 8)} Solved`} sublabel="LeetCode Arena Practice" icon={Code2} color="text-amber-400" bg="bg-amber-500/10" />
        <MetricCard label="Resume ATS Fit" value="78/100" sublabel="FAANG Keyword Match" icon={FileText} color="text-emerald-400" bg="bg-emerald-500/10" />
      </div>

      {/* Action Strip: Adaptive Mock Interview Launchpad */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              <span>Adaptive AI Mock Interview Studio</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Launch a live session with real-time difficulty adaptation, voice speech analysis, and contextual follow-ups
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AddNewInterview />
        </div>
      </section>

      {/* Core Features Hub Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Integrated Placement &amp; Career Hub</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every feature works together to build your complete candidate profile
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. LeetCode Arena */}
          <Link href="/dashboard/leetcode"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 border border-amber-500/20 hover:border-amber-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">Blind 75</span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">LeetCode &amp; Coding Arena</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Multi-language code editor with instant AI verification of Big-O complexity, test cases &amp; edge cases.</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="text-slate-400 font-normal">JS, Python, Java, C++, Go</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Open Arena <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>

          {/* 2. Resume ATS Analyzer */}
          <Link href="/dashboard/resume"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 border border-emerald-500/20 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">PDF / DOCX</span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">Resume Analyzer &amp; ATS Score</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Extract projects &amp; skills, detect keyword gaps, and launch custom Resume-Based Mock Interviews.</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="text-slate-400 font-normal">ATS Score Breakdown</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Analyze Resume <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>

          {/* 3. Skill Gap Analyzer */}
          <Link href="/dashboard/skillgap"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 border border-purple-500/20 hover:border-purple-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-bold">4-Week Plan</span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base group-hover:text-purple-300 transition-colors">Skill Gap Analyzer &amp; Roadmaps</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Benchmark your skills vs target roles and generate a tailored week-by-week placement study plan.</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-purple-400">
                <span className="text-slate-400 font-normal">Personalized Milestones</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Explore Plan <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>

          {/* 4. Communication Trainer */}
          <Link href="/dashboard/communication"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 border border-rose-500/20 hover:border-rose-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">Voice STT</span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base group-hover:text-rose-300 transition-colors">Communication Trainer</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Practice answers with voice recording. AI calculates speaking pace (WPM), filler words &amp; STAR alignment.</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-rose-400">
                <span className="text-slate-400 font-normal">Speech Telemetry</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Train Voice <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>

          {/* 5. Job & Application Tracker */}
          <Link href="/dashboard/jobs"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 border border-teal-500/20 hover:border-teal-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px] font-bold">Pipeline</span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base group-hover:text-teal-300 transition-colors">Job &amp; Interview Tracker</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Track all applications, stages &amp; deadlines. One-click practice interviews tailored for each company.</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-teal-400">
                <span className="text-slate-400 font-normal">Stages &amp; Shortcuts</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Track Jobs <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>

          {/* 6. Placement Roadmaps & Tracks */}
          <Link href="/dashboard/courses"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 border border-blue-500/20 hover:border-blue-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold">22 Tracks</span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base group-hover:text-blue-300 transition-colors">Courses &amp; Placement Tracks</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Curated study roadmaps &amp; playlists covering DSA, System Design, Core CS, Full-Stack, AI &amp; DevOps.</p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-bold text-blue-400">
                <span className="text-slate-400 font-normal">Striver • Gaurav Sen</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Explore Tracks <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Identified Strengths & Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel rounded-3xl border border-emerald-500/20 p-6 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Candidate Strengths
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> React &amp; Frontend Component Architecture</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Data Structures (Arrays, Two Pointers, Trees)</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Clear problem framing and trade-off articulation</li>
          </ul>
        </div>

        <div className="glass-panel rounded-3xl border border-amber-500/20 p-6 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" /> High-Impact Focus Areas
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Containerization &amp; Docker deployment workflows</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Concurrency and Redis caching invalidation strategies</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Structuring behavioral answers strictly using STAR method</li>
          </ul>
        </div>
      </div>

      {/* Previous Interviews List */}
      <section className="pt-2">
        <InterviewList />
      </section>
    </div>
  );
};

export default Dashboard;
