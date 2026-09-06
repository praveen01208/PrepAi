"use client";

import React, { useState, useRef } from "react";
import {
  FileText, Upload, Sparkles, CheckCircle2, AlertCircle, XCircle,
  TrendingUp, Target, Zap, ChevronRight, ArrowLeft, BarChart3,
  AlertTriangle, Star, Lightbulb, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const ScoreRing = ({ score, size = 120, label }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22d3ee" : score >= 60 ? "#a78bfa" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="text-center -mt-[calc(var(--size)/2+12px)]" style={{ marginTop: `-${size / 2 + 12}px` }}>
        <div className="text-2xl font-black text-white" style={{ color }}>{score}</div>
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
};

const SectionCard = ({ name, data }) => {
  const statusColor = data.status === "good" ? "text-cyan-400" : data.status === "needs_work" ? "text-red-400" : "text-amber-400";
  const StatusIcon = data.status === "good" ? CheckCircle2 : data.status === "needs_work" ? XCircle : AlertCircle;

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${statusColor}`} />
          <span className="font-bold text-white capitalize text-sm">{name}</span>
        </div>
        <span className={`text-lg font-black ${statusColor}`}>{data.score}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
        <div
          className="h-1.5 rounded-full transition-all duration-1000"
          style={{ width: `${data.score}%`, background: data.status === "good" ? "#22d3ee" : data.status === "needs_work" ? "#ef4444" : "#f59e0b" }}
        />
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{data.feedback}</p>
    </div>
  );
};

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      toast.error("Please upload a .txt file or paste your resume text below");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result);
    reader.readAsText(file);
    toast.success("Resume file loaded!");
  };

  const analyze = async () => {
    if (!resumeText.trim()) { toast.error("Please paste your resume text or upload a file"); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      toast.success("Resume analysis complete!");
    } catch (e) {
      toast.error(e.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Ambient glows */}
      <div className="ambient-glow bg-emerald-500/20 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="ambient-glow bg-cyan-500/15 w-[350px] h-[350px] top-1/3 -right-20" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 rounded-xl glass-card border border-white/10 hover:border-cyan-500/30 transition-all text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">AI Resume Analyzer</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">BETA</span>
          </div>
          <p className="text-sm text-slate-400">Get instant ATS score, impact analysis & actionable improvements</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-300">Resume Text</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all font-semibold"
              >
                <Upload className="w-3.5 h-3.5" /> Upload .txt
              </button>
              <input ref={fileInputRef} type="file" accept=".txt" className="hidden" onChange={handleFileUpload} />
            </div>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume text here — work experience, skills, education, projects..."
              className="w-full h-52 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 resize-none transition-all"
            />
            <div className="text-xs text-slate-500">{resumeText.length} / 4000 characters</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
            <label className="text-sm font-bold text-slate-300 block">Target Role (Optional)</label>
            <input
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 transition-all"
            />
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> ATS compatibility score</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Section-by-section scoring</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Missing keywords & action verbs</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Quantification tips</div>
            </div>
            <button
              onClick={analyze}
              disabled={loading || !resumeText.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Analyze Resume</>}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Score Cards */}
          <div className="glass-panel rounded-3xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" /> Overall Assessment
            </h2>
            <div className="flex flex-wrap gap-8 justify-center sm:justify-start mb-6">
              <ScoreRing score={result.overallScore} label="Overall" />
              <ScoreRing score={result.atsScore} label="ATS Score" />
              <ScoreRing score={result.impactScore} label="Impact" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed bg-white/5 rounded-2xl p-4 border border-white/10">{result.summary}</p>
          </div>

          {/* Section Scores */}
          {result.sections && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" /> Section Analysis
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.sections).map(([name, data]) => (
                  <SectionCard key={name} name={name} data={data} />
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {result.improvements?.length > 0 && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" /> Priority Improvements
              </h2>
              <div className="space-y-3">
                {result.improvements.map((imp, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      imp.priority === "high" ? "bg-red-500/15 text-red-400 border border-red-500/20" :
                      imp.priority === "medium" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" :
                      "bg-slate-500/15 text-slate-400 border border-slate-500/20"
                    }`}>{imp.priority}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{imp.issue}</p>
                      <p className="text-xs text-slate-400 mt-1">{imp.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords & Action Verbs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {result.missingKeywords?.length > 0 && (
              <div className="glass-panel rounded-3xl border border-white/10 p-6">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {result.quantificationTips?.length > 0 && (
              <div className="glass-panel rounded-3xl border border-white/10 p-6">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> Quantification Tips
                </h3>
                <ul className="space-y-2">
                  {result.quantificationTips.map((tip, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
