"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  BrainCircuit,
  Building2,
  Briefcase,
  Calendar,
  Layers,
  Terminal,
  Code2,
  FileText,
  Sliders,
  Flame,
  ShieldCheck,
  ChevronRight,
  LoaderCircle,
  AlertCircle,
  Zap,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";

const ROLE_PRESETS = [
  {
    role: "Full Stack Developer",
    exp: "3",
    type: "Mixed",
    diff: "Intermediate",
    desc: "React, Node.js, Next.js, PostgreSQL, REST APIs, System Design & Architecture"
  },
  {
    role: "Frontend Engineer",
    exp: "2",
    type: "Technical",
    diff: "Intermediate",
    desc: "React, TypeScript, Next.js, Tailwind CSS, State Management, Web Performance"
  },
  {
    role: "Backend Engineer",
    exp: "4",
    type: "Technical",
    diff: "Advanced",
    desc: "Python/Go/Node, FastAPI, Distributed Systems, SQL/NoSQL Optimization, CI/CD"
  },
  {
    role: "Java Backend Developer",
    exp: "4",
    type: "Technical",
    diff: "Advanced",
    desc: "Java 17+, Spring Boot, Microservices, Hibernate/JPA, MySQL, Kafka, Redis"
  },
  {
    role: "AI / ML Engineer",
    exp: "3",
    type: "Technical",
    diff: "Intermediate",
    desc: "Python, PyTorch, LLMs, Vector DBs, Model Fine-tuning, RAG, ML Pipelines"
  },
  {
    role: "DevOps / Cloud Engineer",
    exp: "4",
    type: "Technical",
    diff: "Advanced",
    desc: "AWS/GCP, Kubernetes, Docker, Terraform, CI/CD pipelines, Prometheus, Linux"
  },
  {
    role: "Data Analyst",
    exp: "2",
    type: "Role-Specific",
    diff: "Intermediate",
    desc: "SQL, Python (Pandas, NumPy), Tableau/PowerBI, Data Wrangling, Statistical Analysis"
  },
  {
    role: "SDE - Campus Placement",
    exp: "0",
    type: "Mixed",
    diff: "Beginner",
    desc: "DSA, OOP Concepts, Core Java/C++, DBMS, OS, Computer Networks, Problem Solving"
  }
];

const INTERVIEW_TYPES = [
  { id: "Technical", label: "Technical Interview", icon: Terminal, desc: "Architecture, frameworks, and system depth" },
  { id: "Coding", label: "Coding Interview", icon: Code2, desc: "Data structures, algorithms, and logic challenges" },
  { id: "Behavioral", label: "Behavioral & STAR", icon: BrainCircuit, desc: "Leadership, conflict resolution, and impact" },
  { id: "HR", label: "HR & Culture Fit", icon: Briefcase, desc: "Career goals, situational questions, team dynamics" },
  { id: "Resume-Based", label: "Resume-Based", icon: FileText, desc: "Deep dive into your exact projects & listed skills" },
  { id: "Mixed", label: "Mixed 360° Session", icon: Sparkles, desc: "Balanced blend of technical, behavioral, and logic" },
];

const DIFFICULTIES = [
  { id: "Beginner", label: "Beginner", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400" },
  { id: "Intermediate", label: "Intermediate", color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400" },
  { id: "Advanced", label: "Advanced", color: "from-purple-500/20 to-indigo-500/20 border-indigo-500/30 text-indigo-400" },
  { id: "Expert", label: "Expert", color: "from-amber-500/20 to-red-500/20 border-red-500/30 text-red-400" },
];

function InterviewLauncherContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobPosition, setJobPosition] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("2");
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [totalQuestions, setTotalQuestions] = useState("5");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [resumeContext, setResumeContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const companyParam = searchParams.get("company");
    const typeParam = searchParams.get("type");
    const diffParam = searchParams.get("diff");
    const expParam = searchParams.get("exp");

    if (roleParam) setJobPosition(roleParam);
    if (companyParam) setTargetCompany(companyParam);
    if (typeParam) setInterviewType(typeParam);
    if (diffParam) setDifficulty(diffParam);
    if (expParam) setJobExperience(expParam);

    if (roleParam && !jobDesc) {
      const match = ROLE_PRESETS.find((p) => p.role.toLowerCase() === roleParam.toLowerCase());
      if (match) {
        setJobDesc(match.desc);
      }
    }
  }, [searchParams]);

  const applyPreset = (preset) => {
    setJobPosition(preset.role);
    setJobDesc(preset.desc);
    setJobExperience(preset.exp);
    setInterviewType(preset.type);
    setDifficulty(preset.diff);
  };

  const startInterview = async (e) => {
    if (e) e.preventDefault();
    if (!jobPosition.trim()) {
      setError("Please specify the target job role / title.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interviews/adaptive/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: jobPosition,
          experienceLevel: jobExperience,
          interviewType,
          initialDifficulty: difficulty,
          totalQuestions: Number(totalQuestions),
          targetCompany,
          preferredLanguage,
          resumeContext: resumeContext || jobDesc,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to initialize interview. Please try again.");
        return;
      }

      if (typeof window !== "undefined" && data.sessionId) {
        try {
          if (data.question) {
            sessionStorage.setItem("prep_ai_init_q_" + data.sessionId, JSON.stringify(data.question));
          }
          sessionStorage.setItem("prep_ai_init_sess_" + data.sessionId, JSON.stringify(data));
        } catch (_) {}
      }

      toast.success("Adaptive AI session initialized!");
      router.push(`/dashboard/interview/${data.sessionId}/start`);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Launch AI Mock Interview
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized adaptive interview session with real-time feedback &amp; difficulty progression
            </p>
          </div>
        </div>

        {targetCompany && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold self-start sm:self-auto">
            <Building2 className="w-3.5 h-3.5" />
            <span>Targeting: <strong className="text-white">{targetCompany}</strong></span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Roles */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Quick Role Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {ROLE_PRESETS.map((p) => {
            const isSelected = jobPosition.toLowerCase() === p.role.toLowerCase();
            return (
              <button
                key={p.role}
                type="button"
                onClick={() => applyPreset(p)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                {p.role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <form onSubmit={startInterview} className="space-y-6">
          {/* Target Role & Target Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Target Job Role / Title *
              </label>
              <Input
                placeholder="e.g. Senior Frontend Engineer, Full Stack Dev"
                required
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="bg-black/30 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Target Company (Optional)
              </label>
              <Input
                placeholder="e.g. Google, Amazon, Microsoft, Startup"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="bg-black/30 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Interview Type Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Interview Format / Focus
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {INTERVIEW_TYPES.map((t) => {
                const Icon = t.icon;
                const isSelected = interviewType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInterviewType(t.id)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[78px] ${
                      isSelected
                        ? "bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                        : "bg-black/20 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-slate-400"}`} />
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <span className="text-xs font-bold text-white mt-2 leading-snug">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Experience & Total Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Starting Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-3 text-xs font-semibold focus:border-cyan-500 focus:outline-none"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Experience (Years)
              </label>
              <Input
                type="number"
                min="0"
                max="20"
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
                className="bg-black/30 border-white/10 text-white rounded-xl h-11 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Question Count
              </label>
              <select
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-3 text-xs font-semibold focus:border-indigo-500 focus:outline-none"
              >
                <option value="3" className="bg-slate-900 text-white">3 Questions (Speed Run)</option>
                <option value="5" className="bg-slate-900 text-white">5 Questions (Standard)</option>
                <option value="7" className="bg-slate-900 text-white">7 Questions (Comprehensive)</option>
                <option value="10" className="bg-slate-900 text-white">10 Questions (Deep Dive)</option>
              </select>
            </div>
          </div>

          {/* Job Description & Tech Stack Context */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Job Description / Tech Stack Details (Optional)
            </label>
            <Textarea
              placeholder="Paste key skills, job requirements, or topics to focus on..."
              rows={3}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="bg-black/30 border-white/10 text-white placeholder:text-slate-500 rounded-xl text-xs focus:border-cyan-500"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Voice transcription, code editor, and instant score analysis included</span>
            </div>

            <Button
              type="submit"
              disabled={loading || !jobPosition.trim()}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Adaptive Session...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start Interview Now</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InterviewLauncherPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading Interview Configurator...</span>
          </div>
        </div>
      }
    >
      <InterviewLauncherContent />
    </Suspense>
  );
}
