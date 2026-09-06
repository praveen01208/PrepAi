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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewDetails();
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interviews/${params.interviewId}`);
      if (!res.ok) throw new Error("Failed to fetch interview");
      const data = await res.json();
      setInterviewData(data);
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
        <span className="text-sm font-semibold">Configuring technical session environment...</span>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="p-8 text-center glass-panel rounded-3xl max-w-lg mx-auto text-red-500 space-y-2">
        <h3 className="font-bold text-lg">Interview Not Found</h3>
        <p className="text-xs text-slate-500">The requested interview session could not be loaded.</p>
        <Link href="/dashboard" className="inline-block mt-4 text-xs font-semibold text-indigo-500 underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full">
          PREP-AI SESSION BRIEFING
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Technical Challenge Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-300 max-w-lg mx-auto">
          Review your session parameters and technical requirements before entering the workspace.
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
                <CheckCircle2 className="w-3.5 h-3.5" /> 5 Challenges Ready
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Job Role:</span>
                <span className="font-black text-lg text-slate-900 dark:text-white">
                  {interviewData.jobPosition}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Focus Areas &amp; Stack:</span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-white/5 font-mono">
                  {interviewData.jobDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xs px-3 py-1 rounded-xl glass-card font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                  Seniority: {interviewData.jobExperience} Years
                </span>
                <span className="text-xs px-3 py-1 rounded-xl glass-card font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                  Evaluation: Code &amp; Concept
                </span>
              </div>
            </div>
          </div>

          {/* Evaluation Rubrics Info */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-cyan-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> AI Evaluation Criteria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">1. Accuracy &amp; Logic</span>
                Correct algorithm implementation and conceptual clarity.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">2. Edge Cases</span>
                Handling boundary conditions, error handling, and null checks.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">3. Efficiency</span>
                Time (Big-O) and Space complexity optimization.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">4. Code Cleanliness</span>
                Modular structure, readable naming, and best practices.
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
                  Interactive Coding Workspace
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  No video or mic needed. You can switch between code and structured text answers, submit for instant AI analysis, and inspect side-by-side ideal solutions.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Support for JavaScript, Python, TypeScript, Java, C++, SQL, &amp; Text</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Real-time Gemini scoring out of 10 with granular improvement tips</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Self-paced progression with question selector navigation</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-white/10">
              <Link
                href={"/dashboard/interview/" + params.interviewId + "/start"}
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
