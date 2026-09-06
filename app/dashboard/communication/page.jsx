"use client";

import React, { useState } from "react";
import {
  MessageSquare, ArrowLeft, Sparkles, RefreshCw, ChevronRight,
  Mic, BarChart3, CheckCircle2, AlertTriangle, Star, Lightbulb,
  Volume2, Target, Award
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const SAMPLE_QUESTIONS = [
  "Tell me about yourself and your background.",
  "Describe a challenging project you worked on and how you handled it.",
  "Why do you want to work at our company?",
  "Tell me about a time you disagreed with a team member and how you resolved it.",
  "Walk me through a system you designed from scratch.",
  "What is your greatest technical weakness and how are you improving it?",
  "How do you handle multiple high-priority tasks with tight deadlines?",
  "Describe a time you took initiative and went beyond your defined scope.",
];

const ScoreBar = ({ label, score, color = "#8b5cf6" }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="font-black" style={{ color }}>{score}/100</span>
    </div>
    <div className="w-full bg-white/10 rounded-full h-2">
      <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: color }} />
    </div>
  </div>
);

export default function CommunicationTrainerPage() {
  const [question, setQuestion] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [context, setContext] = useState("Technical interview for a software engineering role");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showImproved, setShowImproved] = useState(false);

  const evaluate = async () => {
    if (!question.trim()) { toast.error("Please enter or select an interview question"); return; }
    if (!userResponse.trim()) { toast.error("Please type your response to evaluate"); return; }
    setLoading(true);
    setResult(null);
    setShowImproved(false);
    try {
      const res = await fetch("/api/communication/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, userResponse, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      toast.success("Communication analysis complete!");
    } catch (e) {
      toast.error(e.message || "Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  const overallColor = result ? (result.overallScore >= 80 ? "#22d3ee" : result.overallScore >= 60 ? "#a78bfa" : "#f59e0b") : "#8b5cf6";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="ambient-glow bg-rose-500/15 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="ambient-glow bg-orange-500/10 w-[350px] h-[350px] top-1/3 -right-20" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 rounded-xl glass-card border border-white/10 hover:border-rose-500/30 transition-all text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Communication Trainer</h1>
          </div>
          <p className="text-sm text-slate-400">Practice STAR answers and get AI feedback on your communication style</p>
        </div>
      </div>

      {/* Sample Questions */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6">
        <h2 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-rose-400" /> Quick Question Picker
        </h2>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => setQuestion(q)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium ${
                question === q
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-rose-500/20 hover:text-slate-200"
              }`}
            >
              {q.length > 45 ? q.substring(0, 45) + "…" : q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-300 block mb-2">Interview Question</label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Enter or pick an interview question..."
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/40 resize-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-300 block mb-2">Your Response</label>
              <textarea
                value={userResponse}
                onChange={e => setUserResponse(e.target.value)}
                placeholder="Type your answer as you'd say it in a real interview. Be as detailed as you would in the actual interview..."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/40 resize-none transition-all"
              />
              <div className="text-xs text-slate-500 mt-1">{userResponse.split(/\s+/).filter(Boolean).length} words</div>
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-300 block mb-2">Context</label>
            <input
              value={context}
              onChange={e => setContext(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-rose-500/40 transition-all"
            />
          </div>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Clarity & conciseness</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> STAR method alignment</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Technical depth scoring</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Improved response rewrite</div>
          </div>
          <button
            onClick={evaluate}
            disabled={loading || !question.trim() || !userResponse.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Evaluating...</> : <><Sparkles className="w-4 h-4" /> Evaluate My Answer</>}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Overall Score */}
          <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={overallColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2.51 * result.overallScore} ${251.2}`} style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black" style={{ color: overallColor }}>{result.overallScore}</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Score</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {result.scores && Object.entries(result.scores).map(([key, val]) => (
                <ScoreBar key={key} label={key.replace(/([A-Z])/g, " $1").trim()} score={val.score} color={overallColor} />
              ))}
            </div>
          </div>

          {/* Detailed Score Feedback */}
          {result.scores && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-rose-400" /> Detailed Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.scores).map(([key, val]) => (
                  <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="font-black text-lg" style={{ color: overallColor }}>{val.score}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{val.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAR Alignment */}
          {result.starAlignment && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" /> STAR Method Analysis
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["situation", "task", "action", "result"].map(key => {
                  const data = result.starAlignment[key];
                  const present = data?.present;
                  return (
                    <div key={key} className={`p-4 rounded-2xl border ${present ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {present ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                        <span className="font-black text-white uppercase text-xs tracking-widest">{key}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${present ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {data?.quality || "—"}
                      </span>
                      {data?.note && <p className="text-xs text-slate-400 mt-2 leading-relaxed">{data.note}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Improvements & Improved Response */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {result.improvements?.length > 0 && (
              <div className="glass-panel rounded-3xl border border-white/10 p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Key Improvements
                </h3>
                <ul className="space-y-3">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <ChevronRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" /> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.tipOfDay && (
              <div className="glass-panel rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Interview Tip
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{result.tipOfDay}</p>
              </div>
            )}
          </div>

          {/* Improved Response */}
          {result.improvedResponse && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" /> AI-Improved Response
                </h3>
                <button
                  onClick={() => setShowImproved(v => !v)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all font-semibold"
                >
                  {showImproved ? "Hide" : "Reveal"}
                </button>
              </div>
              {showImproved && (
                <div className="p-4 rounded-2xl bg-white/5 border border-cyan-500/10 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-300">
                  {result.improvedResponse}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
