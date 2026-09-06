"use client";

import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import { Sparkles, Terminal, Code2, Zap, BrainCircuit, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Ambient background glows */}
      <div className="ambient-glow bg-cyan-500/20 w-[450px] h-[450px] -top-24 -left-24" />
      <div className="ambient-glow bg-indigo-500/20 w-[450px] h-[450px] top-1/4 -right-24" />

      {/* Hero Glass Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 border border-indigo-500/20 dark:border-cyan-500/20 text-xs font-bold text-indigo-600 dark:text-cyan-400">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>PREP-AI INTELLIGENCE ENGINE</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Master Technical &amp; Coding Interviews with <span className="text-gradient">PREP-AI</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Generate custom technical questions tailored to your tech stack. Type your written solutions or code directly into the workspace for instant Gemini AI feedback, scoring, and algorithmic breakdown.
            </p>
          </div>

          {/* Quick Metrics Bento Card */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 w-full lg:w-auto">
            <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-white/10 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold uppercase tracking-wider">Evaluation</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">Code &amp; Logic</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-white/10 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold uppercase tracking-wider">AI Scoring</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">Instant 360°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Features Hub Bento Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Full-Fledged Placement &amp; Interview Hub</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive prep tracks for top tech companies and college campus placements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LeetCode Arena Card */}
          <Link
            href="/dashboard/leetcode"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-7 border border-indigo-500/30 hover:border-indigo-500/60 dark:border-cyan-500/20 dark:hover:border-cyan-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
                  LeetCode Arena
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  DSA Problem Arena &amp; Code Judge
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Solve top curated DSA problems with live multi-language code editor (Python, Java, C++, JS, TS, Go), sample test cases, and instant Gemini AI code judging.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-cyan-400">
                <span className="text-slate-400">Blind 75 &bull; FAANG Curated</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open LeetCode Arena &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* Placement Courses & Playbooks Card */}
          <Link
            href="/dashboard/courses"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-7 border border-purple-500/30 hover:border-purple-500/60 dark:border-purple-500/20 dark:hover:border-purple-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 text-xs font-bold">
                  College &amp; Placements
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  Curated Placement Roadmaps &amp; YouTube Playlists
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Structured tracks with high-yield YouTube playlists (Striver SDE Sheet, Gaurav Sen System Design, Harkirat Full-Stack, Gate Smashers Core CS, Aptitude &amp; HR).
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-300">
                <span className="text-slate-400">5 Structured Tracks</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Roadmaps &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Action Strip: Add Interview */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-500" />
              <span>Custom AI Mock Interview Sessions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your role and tech stack to generate personalized technical challenges &amp; code evaluation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AddNewInterview />
        </div>
      </section>

      {/* Previous Interviews List */}
      <section className="pt-2">
        <InterviewList />
      </section>
    </div>
  );
};

export default Dashboard;
