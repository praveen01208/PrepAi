"use client";

import React, { useState, useEffect } from "react";
import {
  Zap, ArrowLeft, Sparkles, RefreshCw, Target, BookOpen, Clock, 
  CheckCircle2, AlertTriangle, TrendingUp, ChevronRight, ExternalLink,
  Star, Award, Map, Check, Code2, BrainCircuit, Calendar, Layers,
  Building2, XCircle
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ROLE_PRESETS = [
  { role: "Full Stack Developer", skills: "React, JavaScript, Node.js, Express, HTML/CSS, basic SQL, Git" },
  { role: "Java Backend Developer", skills: "Core Java, OOP, basic Spring Boot, MySQL, REST APIs, Git" },
  { role: "Frontend Engineer", skills: "React, TypeScript, Tailwind CSS, Redux, Next.js, Webpack, Git" },
  { role: "Backend Engineer", skills: "Python, FastAPI, PostgreSQL, basic Docker, REST APIs, Linux" },
  { role: "AI / ML Engineer", skills: "Python, NumPy, Pandas, Scikit-learn, basic PyTorch, SQL" },
  { role: "DevOps Engineer", skills: "Linux, Bash, Docker, Git, CI/CD, basic AWS, Python" },
  { role: "Data Analyst", skills: "SQL, Python (Pandas), Excel, Tableau, Statistical Analysis" },
  { role: "SDE - Campus Placement", skills: "C++, Data Structures & Algorithms, OOP, DBMS, OS Basics" }
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "Full Stack Developer";

  const [currentSkills, setCurrentSkills] = useState("React, JavaScript, Node.js, HTML/CSS, basic SQL, Git");
  const [targetRole, setTargetRole] = useState(initialRole);
  const [targetCompany, setTargetCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (initialRole) {
      setTargetRole(initialRole);
      const matched = ROLE_PRESETS.find(p => p.role.toLowerCase() === initialRole.toLowerCase());
      if (matched) setCurrentSkills(matched.skills);
    }
  }, [initialRole]);

  const applyPreset = (preset) => {
    setTargetRole(preset.role);
    setCurrentSkills(preset.skills);
  };

  const analyze = async () => {
    if (!currentSkills.trim()) {
      toast.error("Please enter your current skills");
      return;
    }
    if (!targetRole.trim()) {
      toast.error("Please select or type a target role");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/skillgap/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills, targetRole, targetCompany }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      toast.success("Skill gap analysis & 4-week roadmap generated!");
    } catch (e) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Ambient Glows */}
      <div className="ambient-glow bg-violet-500/20 w-[450px] h-[450px] -top-20 -left-20" />
      <div className="ambient-glow bg-blue-500/15 w-[400px] h-[400px] top-1/3 -right-20" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-xl glass-card border border-white/10 hover:border-purple-500/30 transition-all text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">AI Skill Gap Analyzer &amp; Roadmaps</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">Discover missing skills for your dream job and receive a personalized 4-week preparation plan</p>
          </div>
        </div>

        {result && (
          <Link href={`/dashboard/interview?role=${encodeURIComponent(targetRole)}`}>
            <Button className="rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs px-5 py-2.5 shadow-lg shadow-purple-500/25 flex items-center gap-2 hover:scale-105 transition">
              <BrainCircuit className="w-4 h-4" />
              <span>Practice Mock Interview for {targetRole}</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Role Presets Chips */}
      <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" /> Target Role Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {ROLE_PRESETS.map((p) => (
            <button
              key={p.role}
              onClick={() => applyPreset(p)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                targetRole === p.role
                  ? "bg-purple-500/20 border-purple-400 text-purple-300"
                  : "glass-card hover:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
              }`}
            >
              {p.role}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 glass-panel rounded-3xl border border-white/10 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white block">Your Current Tech Stack &amp; Skills</label>
            <span className="text-xs text-slate-400">List skills, tools, and libraries you know</span>
          </div>
          <textarea
            value={currentSkills}
            onChange={e => setCurrentSkills(e.target.value)}
            placeholder="e.g. React (2 yrs), Node.js, Express, JavaScript, HTML/CSS, basic SQL, Git, REST APIs..."
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 resize-none font-mono leading-relaxed transition-all"
          />
        </div>

        {/* Target Role & Submit */}
        <div className="lg:col-span-5 glass-panel rounded-3xl border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Target Role *</label>
              <input
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Java Backend Developer"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Target Company (Optional)</label>
              <input
                value={targetCompany}
                onChange={e => setTargetCompany(e.target.value)}
                placeholder="e.g. Google, Amazon, Flipkart, TCS, Startup"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 transition-all"
              />
            </div>
          </div>

          <Button
            onClick={analyze}
            disabled={loading || !currentSkills.trim() || !targetRole.trim()}
            className="w-full py-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-sm shadow-xl shadow-purple-500/25 hover:scale-[1.01] transition mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Benchmarking Gaps &amp; Roadmaps...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Analyze Skill Gap &amp; Generate Roadmap
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Readiness Score Banner */}
          <div className="glass-panel rounded-3xl border border-purple-500/30 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 text-white flex flex-col items-center justify-center font-black text-2xl shadow-lg shadow-purple-500/30 shrink-0">
                <span>{result.readinessScore}%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Ready</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Career Readiness Assessment
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Target: {targetRole} {targetCompany ? `at ${targetCompany}` : ""}
                </h3>
                <div className="text-slate-400 text-xs mt-1 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Estimated Time to Job-Ready: <span className="text-amber-400 font-bold">{result.timeToReady}</span>
                </div>
              </div>
            </div>

            {result.summary && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6 max-w-md">
                {result.summary}
              </p>
            )}
          </div>

          {/* Skill Breakdown: Strong vs Developing vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Strong Skills */}
            <div className="glass-panel rounded-3xl border border-emerald-500/20 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Strong Demonstrated Skills
              </h3>
              <div className="space-y-2">
                {result.strongSkills?.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{s.skill}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${LEVEL_COLORS[s.level] || LEVEL_COLORS.advanced}`}>{s.level}</span>
                    </div>
                    {s.note && <p className="text-[11px] text-slate-400">{s.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Developing Skills */}
            <div className="glass-panel rounded-3xl border border-amber-500/20 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" /> Developing Skills
              </h3>
              <div className="space-y-2">
                {result.developingSkills?.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{d.skill}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${LEVEL_COLORS[d.level] || LEVEL_COLORS.intermediate}`}>{d.level}</span>
                    </div>
                    {d.note && <p className="text-[11px] text-slate-400">{d.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-panel rounded-3xl border border-rose-500/20 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Critical Missing Skills
              </h3>
              <div className="space-y-3">
                {result.missingSkills?.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{m.skill}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${PRIORITY_COLORS[m.priority] || PRIORITY_COLORS.high}`}>
                        {m.priority}
                      </span>
                    </div>
                    {m.resources && m.resources.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {m.resources.map((res, j) => (
                          <a
                            key={j}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-cyan-300 transition"
                          >
                            <span className="truncate flex items-center gap-1.5"><BookOpen className="w-3 h-3 shrink-0" /> {res.title}</span>
                            <ExternalLink className="w-3 h-3 opacity-60 shrink-0 ml-1" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Week Personalized Preparation Roadmap */}
          {result.learningPath && result.learningPath.length > 0 && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-7 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Step-by-Step Preparation Plan
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    Personalized 4-Week Placement Roadmap
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.learningPath.map((step, idx) => (
                  <div key={idx} className="p-5 rounded-2xl glass-card border border-white/10 space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 font-black text-xs flex items-center justify-center border border-purple-500/30">
                          W{step.week}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Week {step.week}</span>
                      </div>
                      <h4 className="text-sm font-black text-white">{step.focus}</h4>
                      <ul className="space-y-1.5 pt-1">
                        {step.tasks?.map((task, j) => (
                          <li key={j} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {step.milestone && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-300 mt-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>Milestone: {step.milestone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Projects to Build */}
          {result.topProjects && result.topProjects.length > 0 && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" /> High-Impact Portfolio Projects to Build
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.topProjects.map((proj, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs font-bold text-white block">Project #{i + 1}</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">{proj}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
