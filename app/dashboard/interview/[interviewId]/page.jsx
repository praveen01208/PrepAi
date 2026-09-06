"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Terminal,
  Code2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  BookOpen,
  Zap,
  Flame,
  BrainCircuit,
  Building2,
  Mic,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Interview = ({ params }) => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionDetails();
  }, [params.interviewId]);

  const fetchSessionDetails = async () => {
    try {
      // Try adaptive endpoint first
      const resAdaptive = await fetch(`/api/interviews/adaptive/${params.interviewId}`);
      if (resAdaptive.ok) {
        const data = await resAdaptive.json();
        if (data && data.session) {
          setSessionData({
            role: data.session.targetRole,
            exp: data.session.experienceLevel,
            type: data.session.interviewType,
            difficulty: data.session.currentDifficulty || data.session.initialDifficulty,
            company: data.session.targetCompany,
            totalQuestions: data.session.totalQuestions,
            language: data.session.preferredLanguage,
            isAdaptive: true
          });
          setLoading(false);
          return;
        }
      }

      // Fallback to legacy mock interview endpoint
      const resLegacy = await fetch(`/api/interviews/${params.interviewId}`);
      if (resLegacy.ok) {
        const data = await resLegacy.json();
        setSessionData({
          role: data.jobPosition,
          exp: data.jobExperience,
          type: "Technical & Coding",
          difficulty: "Intermediate",
          desc: data.jobDesc,
          totalQuestions: 5,
          isAdaptive: false
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 text-slate-500">
        <Sparkles className="w-8 h-8 text-cyan-500 animate-spin" />
        <span className="text-sm font-semibold">Configuring adaptive interview workspace...</span>
      </div>
    );
  }

  const role = sessionData?.role || "Software Engineer";
  const exp = sessionData?.exp || "2";
  const type = sessionData?.type || "Technical";
  const diff = sessionData?.difficulty || "Intermediate";
  const company = sessionData?.company;
  const totalQ = sessionData?.totalQuestions || 5;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full">
          <BrainCircuit className="w-3.5 h-3.5" /> PREP-AI ADAPTIVE SESSION BRIEFING
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Session Parameters &amp; Objectives
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-300 max-w-lg mx-auto">
          Review your target profile and evaluation criteria before entering the live adaptive workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side - Target Profile & Topics */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-200/80 dark:border-white/10 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-500" /> Target Profile
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {totalQ} Dynamic Questions Ready
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Target Role:</span>
                <span className="font-black text-xl text-slate-900 dark:text-white">
                  {role}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Interview Type</span>
                  <span className="text-xs font-bold text-cyan-400">{type}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Seniority</span>
                  <span className="text-xs font-bold text-slate-200">{exp} Years Exp</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Initial Level</span>
                  <span className="text-xs font-bold text-purple-400">{diff}</span>
                </div>
              </div>

              {company && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
                  <Building2 className="w-4 h-4 text-cyan-400" /> Target Company: {company}
                </div>
              )}
            </div>
          </div>

          {/* Adaptive AI Evaluation Model */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-cyan-400 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Adaptive Decision Flow
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                <span className="font-bold text-emerald-400 block mb-1">Score ≥ 80%</span>
                AI escalates difficulty to Advanced and asks deeper architectural challenges.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                <span className="font-bold text-cyan-400 block mb-1">Score 60–79%</span>
                AI maintains level and probes with context-aware follow-up questions.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                <span className="font-bold text-amber-400 block mb-1">Score &lt; 60%</span>
                AI identifies weakness, simplifies concepts, and tests fundamentals.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Workspace Instructions & Enter Room */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Interactive Interview Room
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Support for Voice input (speech recognition + filler word analysis), Code Editor, or Markdown notes.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mic className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Voice STT + Live filler words &amp; speaking pace tracking</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Code Editor with JS, Python, Java, C++, TypeScript, Go &amp; SQL</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>TTS speech synthesis for listening to interviewer questions</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-white/10">
              <Link
                href={`/dashboard/interview/${params.interviewId}/start`}
                className="block w-full"
              >
                <Button className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-black text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 py-6">
                  <span>Enter Interview Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
