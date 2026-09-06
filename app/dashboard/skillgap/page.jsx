"use client";

import React, { useState } from "react";
import {
  Zap, ArrowLeft, Sparkles, RefreshCw, Target, BookOpen, Clock, 
  CheckCircle2, AlertTriangle, TrendingUp, ChevronRight, ExternalLink,
  Star, Award, Map
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const ROLES = [
  "Frontend Engineer", "Backend Engineer", "Full Stack Developer",
  "Software Development Engineer (SDE)", "DevOps Engineer", "ML Engineer",
  "Data Engineer", "Android Developer", "iOS Developer", "QA Engineer"
];

const PRIORITY_COLORS = {
  critical: "bg-red-500/10 border-red-500/20 text-red-400",
  high: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  medium: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  low: "bg-slate-500/10 border-slate-500/20 text-slate-400",
};

const LEVEL_COLORS = {
  beginner: "bg-red-500/10 text-red-400",
  intermediate: "bg-amber-500/10 text-amber-400",
  advanced: "bg-emerald-500/10 text-emerald-400",
  expert: "bg-cyan-500/10 text-cyan-400",
};

export default function SkillGapPage() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (!currentSkills.trim()) { toast.error("Please enter your current skills"); return; }
    if (!targetRole.trim()) { toast.error("Please select or type a target role"); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/skillgap/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills, targetRole, targetCompany }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      toast.success("Skill gap analysis complete!");
    } catch (e) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="ambient-glow bg-violet-500/20 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="ambient-glow bg-blue-500/15 w-[350px] h-[350px] top-1/3 -right-20" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 rounded-xl glass-card border border-white/10 hover:border-purple-500/30 transition-all text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">AI Skill Gap Analyzer</h1>
          </div>
          <p className="text-sm text-slate-400">Discover exactly what skills you need to land your dream role</p>
        </div>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
          <label className="text-sm font-bold text-slate-300 block">Your Current Skills</label>
          <textarea
            value={currentSkills}
            onChange={e => setCurrentSkills(e.target.value)}
            placeholder="List your skills, technologies, and experience levels...&#10;e.g. React (2 yrs), Node.js (1 yr), basic Python, some SQL, Git..."
            className="w-full h-36 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 resize-none transition-all"
          />
        </div>
        <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-300 block mb-2">Target Role</label>
            <input
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Developer"
              list="roles-list"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 transition-all"
            />
            <datalist id="roles-list">
              {ROLES.map(r => <option key={r} value={r} />)}
            </datalist>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-300 block mb-2">Target Company (Optional)</label>
            <input
              value={targetCompany}
              onChange={e => setTargetCompany(e.target.value)}
              placeholder="e.g. Google, Flipkart, Startup"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 transition-all"
            />
          </div>
          <button
            onClick={analyze}
            disabled={loading || !currentSkills.trim() || !targetRole.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Analyze Skill Gap</>}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Readiness Banner */}
          <div className="glass-panel rounded-3xl border border-purple-500/30 p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2.51 * result.readinessScore} ${251.2}`} style={{ transition: "stroke-dasharray 1s ease" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-purple-400">{result.readinessScore}%</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Ready</span>
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-white">Readiness Score</div>
                <div className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" /> 
                  Time to job-ready: <span className="text-amber-400 font-bold">{result.timeToReady}</span>
                </div>
              </div>
            </div>
            {result.summary && (
              <p className="text-sm text-slate-300 leading-relaxed border-l border-white/10 pl-6 flex-1">{result.summary}</p>
            )}
          </div>

          {/* Skill Gaps */}
          {result.gaps?.length > 0 && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" /> Skill Gaps to Bridge
              </h2>
              <div className="space-y-4">
                {result.gaps.map((gap, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="font-bold text-white text-base">{gap.skill}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${PRIORITY_COLORS[gap.priority]}`}>{gap.priority}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${LEVEL_COLORS[gap.currentLevel]}`}>{gap.currentLevel}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${LEVEL_COLORS[gap.requiredLevel]}`}>{gap.requiredLevel}</span>
                      </div>
                    </div>
                    {gap.resources?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {gap.resources.map((res, j) => (
                          <a key={j} href={res.url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all text-xs text-slate-300 hover:text-purple-300">
                            <BookOpen className="w-3 h-3" />
                            {res.title}
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Learning Path */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {result.strengths?.length > 0 && (
              <div className="glass-panel rounded-3xl border border-white/10 p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Your Strengths
                </h3>
                <div className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-sm font-semibold text-white">{s.skill}</span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${LEVEL_COLORS[s.level]}`}>{s.level}</span>
                        {s.note && <p className="text-xs text-slate-400 mt-0.5">{s.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.learningPath?.length > 0 && (
              <div className="glass-panel rounded-3xl border border-white/10 p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Map className="w-4 h-4 text-cyan-400" /> Learning Roadmap
                </h3>
                <div className="space-y-3 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10" />
                  {result.learningPath.map((step, i) => (
                    <div key={i} className="flex gap-4 pl-8 relative">
                      <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-slate-900 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-purple-400 mb-1">Week {step.week}: {step.focus}</div>
                        <ul className="space-y-0.5">
                          {step.tasks?.map((task, j) => (
                            <li key={j} className="text-xs text-slate-400 flex items-start gap-1.5">
                              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" /> {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Projects & Certs */}
          {(result.certifications?.length > 0 || result.topProjects?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {result.certifications?.length > 0 && (
                <div className="glass-panel rounded-3xl border border-white/10 p-6">
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" /> Recommended Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.certifications.map((cert, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">{cert}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.topProjects?.length > 0 && (
                <div className="glass-panel rounded-3xl border border-white/10 p-6">
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" /> Portfolio Projects to Build
                  </h3>
                  <ul className="space-y-2">
                    {result.topProjects.map((proj, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" /> {proj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
