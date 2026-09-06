"use client";

import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import {
  Sparkles, Terminal, Code2, Zap, BrainCircuit, FileText,
  MessageSquare, Briefcase, ArrowRight
} from "lucide-react";
import Link from "next/link";

const FeatureCard = ({ href, icon: Icon, gradient, borderColor, badgeColor, badge, title, description, footer, footerLink }) => (
  <Link
    href={href}
    className={`group relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-7 border ${borderColor} shadow-xl transition-all duration-300 hover:scale-[1.01]`}
  >
    <div className={`absolute top-0 right-0 w-64 h-64 ${gradient} rounded-full blur-3xl pointer-events-none transition-all`} />
    <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl ${icon} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`px-3 py-1 rounded-full ${badgeColor} border text-xs font-bold`}>{badge}</span>
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:opacity-90 transition-colors">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{description}</p>
      </div>
      <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
        <span>{footer}</span>
        <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-indigo-400 dark:text-cyan-400">
          Open <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  </Link>
);

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
              Generate custom technical questions tailored to your tech stack. Practice coding, analyze your resume, track job applications, and train your communication skills — all powered by Gemini AI.
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
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Full-Fledged Placement &amp; Interview Hub</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive prep tools powered by Gemini AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LeetCode Arena */}
          <Link href="/dashboard/leetcode"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-7 border border-indigo-500/30 hover:border-indigo-500/60 dark:border-cyan-500/20 dark:hover:border-cyan-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">LeetCode Arena</span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">DSA Problem Arena &amp; Code Judge</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">Solve curated DSA problems with live multi-language code editor. Get instant Gemini AI evaluation on correctness, complexity, and edge cases.</p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-cyan-400">
                <span className="text-slate-400">Blind 75 • FAANG Curated</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Open <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          </Link>

          {/* Placement Courses */}
          <Link href="/dashboard/courses"
            className="group relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-7 border border-purple-500/30 hover:border-purple-500/60 dark:border-purple-500/20 dark:hover:border-purple-500/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 text-xs font-bold">22 Tracks</span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">Curated Placement Roadmaps &amp; YouTube Playlists</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">22 structured learning tracks covering DSA, System Design, Full-Stack, Core CS, DevOps, AI/ML and more.</p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-300">
                <span className="text-slate-400">Striver • Gaurav Sen • Harkirat</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* AI-Powered Career Tools */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>AI-Powered Career Tools</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Get personalized AI insights to accelerate your job search
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Resume Analyzer */}
          <Link href="/dashboard/resume"
            className="group relative overflow-hidden rounded-3xl glass-panel p-5 border border-emerald-500/20 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors">Resume Analyzer</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">ATS score, keyword gaps & section-by-section improvements</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Analyze <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Skill Gap Analyzer */}
          <Link href="/dashboard/skillgap"
            className="group relative overflow-hidden rounded-3xl glass-panel p-5 border border-violet-500/20 hover:border-violet-500/50 shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-violet-300 transition-colors">Skill Gap Analyzer</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Discover missing skills & get personalized learning roadmaps</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-400 group-hover:translate-x-1 transition-transform">
                Analyze <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Communication Trainer */}
          <Link href="/dashboard/communication"
            className="group relative overflow-hidden rounded-3xl glass-panel p-5 border border-rose-500/20 hover:border-rose-500/50 shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-rose-300 transition-colors">Communication Trainer</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Practice STAR answers & get scored on clarity, structure & impact</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
                Practice <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Job Tracker */}
          <Link href="/dashboard/jobs"
            className="group relative overflow-hidden rounded-3xl glass-panel p-5 border border-teal-500/20 hover:border-teal-500/50 shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-teal-300 transition-colors">Job Tracker</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Track all your applications, statuses, deadlines & offer letters</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
                Track <ArrowRight className="w-3 h-3" />
              </span>
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
