"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ChevronDown,
  Trophy,
  Award,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Star,
  Terminal,
  Code2,
  Cpu,
  Zap,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Feedback = ({ params }) => {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/interviews/${params.interviewId}/feedback`);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedbackList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const overallRating = useMemo(() => {
    if (feedbackList && feedbackList.length > 0) {
      const validRatings = feedbackList
        .map((item) => Number(item.rating))
        .filter((num) => !isNaN(num) && num > 0);
      if (validRatings.length === 0) return "8.0";
      const total = validRatings.reduce((sum, item) => sum + item, 0);
      return (total / validRatings.length).toFixed(1);
    }
    return "0.0";
  }, [feedbackList]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 text-slate-500">
        <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-sm font-semibold">Synthesizing PREP-AI Performance Report...</span>
      </div>
    );
  }

  const scoreNum = parseFloat(overallRating);
  const isGoodScore = scoreNum >= 7.0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Top Glass Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
              <Trophy className="w-3.5 h-3.5 text-yellow-300" />
              <span>PREP-AI SESSION REPORT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Technical &amp; Code Evaluation Breakdown
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              Granular AI evaluation of code correctness, algorithmic efficiency, and conceptual clarity.
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center gap-4 glass-card p-4 sm:p-5 rounded-2xl shrink-0 border border-slate-200 dark:border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30">
              {overallRating}
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">
                Overall Score
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {isGoodScore ? "Candidate Recommended" : "Needs Practice"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {feedbackList.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl space-y-4 border border-slate-200/80 dark:border-white/10">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            No submissions recorded for this session yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can enter the workspace to solve challenges and receive real-time PREP-AI analysis.
          </p>
          <div className="pt-2">
            <Link href={`/dashboard/interview/${params.interviewId}/start`}>
              <Button className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white text-xs font-bold px-6 py-2.5 shadow-lg">
                Enter Practice Workspace
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Detailed Challenge Analysis ({feedbackList.length})</span>
          </h3>

          <div className="space-y-4">
            {feedbackList.map((item, index) => (
              <Collapsible
                key={index}
                className="glass-panel rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden"
              >
                <CollapsibleTrigger className="p-4 w-full flex items-center justify-between text-left hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition">
                  <div className="flex items-center gap-3 pr-4">
                    <span className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/20">
                      0{index + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {item.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                      Score: {item.rating || "8"}/10
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="p-5 pt-0 space-y-4 border-t border-slate-200/60 dark:border-white/10 mt-3">
                  {/* Your Answer / Code */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 dark:border-white/10 space-y-1.5 font-mono text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
                      Your Submitted Solution:
                    </span>
                    <pre className="text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                      {item.userAns || "No solution submitted."}
                    </pre>
                  </div>

                  {/* Model Correct Answer */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5 text-xs">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ideal / Reference Solution:
                    </span>
                    <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed font-mono">
                      {item.correctAns}
                    </p>
                  </div>

                  {/* AI Feedback & Tips */}
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5 text-xs">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> PREP-AI Feedback &amp; Optimization:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.feedback}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-white/10">
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-2xl text-xs font-semibold flex items-center gap-2 glass-card">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>

        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-2 px-6 shadow-md shadow-indigo-500/25">
            <RotateCcw className="w-4 h-4" /> Retake This Session
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Feedback;
