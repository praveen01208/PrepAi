"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Sparkles,
  LoaderCircle,
  Briefcase,
  Code2,
  Calendar,
  Layers,
  AlertCircle,
  Terminal,
  BrainCircuit,
  Building2,
  FileText,
  Flame,
  ShieldCheck,
  ChevronRight,
  Sliders
} from "lucide-react";
import { useRouter } from "next/navigation";
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
    desc: "React, TypeScript, Next.js, Tailwind CSS, State Management, Web Performance & DOM"
  },
  {
    role: "Java Backend Developer",
    exp: "4",
    type: "Technical",
    diff: "Advanced",
    desc: "Java 17+, Spring Boot, Microservices, Hibernate/JPA, MySQL, Kafka, Redis, Docker"
  },
  {
    role: "Backend Engineer",
    exp: "4",
    type: "Technical",
    diff: "Advanced",
    desc: "Python/Go/Node, FastAPI, Distributed Systems, SQL/NoSQL Optimization, CI/CD"
  },
  {
    role: "AI / ML Engineer",
    exp: "3",
    type: "Technical",
    diff: "Intermediate",
    desc: "Python, PyTorch/TensorFlow, LLMs, Vector DBs, Model Fine-tuning, RAG, ML Pipelines"
  },
  {
    role: "Data Analyst",
    exp: "2",
    type: "Role-Specific",
    diff: "Intermediate",
    desc: "SQL, Python (Pandas, NumPy), Tableau/PowerBI, Data Wrangling, Statistical Analysis"
  },
  {
    role: "DevOps / Cloud Engineer",
    exp: "4",
    type: "Technical",
    diff: "Advanced",
    desc: "AWS/GCP, Kubernetes, Docker, Terraform, CI/CD pipelines, Prometheus, Linux"
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
  { id: "Role-Specific", label: "Role-Specific", icon: Layers, desc: "Targeted domain questions for niche roles" }
];

const DIFFICULTIES = [
  { id: "Beginner", label: "Beginner", desc: "Foundational concepts & basic problem solving", color: "text-emerald-400 border-emerald-500/30" },
  { id: "Intermediate", label: "Intermediate", desc: "Industry standard & real-world trade-offs", color: "text-cyan-400 border-cyan-500/30" },
  { id: "Advanced", label: "Advanced", desc: "High-scale architecture & tricky edge cases", color: "text-purple-400 border-purple-500/30" }
];

const PROGRAMMING_LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "SQL"
];

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("config"); // "config" | "resume"
  
  // Form State
  const [jobPosition, setJobPosition] = useState("");
  const [jobExperience, setJobExperience] = useState("3");
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [targetCompany, setTargetCompany] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("JavaScript");
  const [resumeContext, setResumeContext] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const applyPreset = (preset) => {
    setJobPosition(preset.role);
    setJobExperience(preset.exp);
    setInterviewType(preset.type);
    setDifficulty(preset.diff);
    if (!resumeContext) setResumeContext(preset.desc);
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!jobPosition.trim()) {
      setError("Please specify a target job role");
      return;
    }

    setLoading(true);
    setError("");

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
          resumeContext
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to initialize interview. Please try again.");
        return;
      }

      // Save initial question & session in sessionStorage for instant offline/caching resiliency
      if (typeof window !== "undefined" && data.sessionId) {
        try {
          if (data.question) {
            sessionStorage.setItem("prep_ai_init_q_" + data.sessionId, JSON.stringify(data.question));
          }
          sessionStorage.setItem("prep_ai_init_sess_" + data.sessionId, JSON.stringify(data));
        } catch (_) {}
      }

      setOpenDialog(false);
      toast.success("Adaptive AI session initialized!");
      router.push(`/dashboard/interview/${data.sessionId}/start`);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add New Trigger Card */}
      <div
        onClick={() => setOpenDialog(true)}
        className="group relative overflow-hidden rounded-3xl p-6 glass-card border border-dashed border-indigo-400/40 dark:border-cyan-500/30 hover:border-indigo-500 dark:hover:border-cyan-400 hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[190px]"
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-md">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 dark:border-cyan-500/20 flex items-center gap-1.5 animate-pulse">
            <BrainCircuit className="w-3.5 h-3.5" /> Adaptive Engine
          </span>
        </div>

        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
            + Start Adaptive AI Mock Interview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Dynamic difficulty (Beginner ↔ Advanced), contextual follow-ups, and live voice/code evaluation.
          </p>
        </div>
      </div>

      {/* Modern Adaptive Configuration Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl w-[95vw] rounded-3xl p-0 overflow-hidden glass-panel border border-white/60 dark:border-white/10 shadow-2xl">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
              <BrainCircuit className="w-4 h-4" /> PREP-AI Adaptive Interview Engine
            </div>
            <DialogTitle className="text-2xl font-black text-white">
              Configure Mock Interview Session
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs mt-1">
              The AI will dynamically change question difficulty and direction based on the quality of your answers.
            </DialogDescription>
          </div>

          <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
            {/* Role Presets */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-cyan-500" /> Popular Role Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_PRESETS.map((p) => (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                      jobPosition === p.role
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "glass-card hover:bg-indigo-50 dark:hover:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {p.role}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Target Role & Experience Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    Target Job Role *
                  </label>
                  <Input
                    className="rounded-xl glass-input text-sm"
                    placeholder="e.g. Senior Frontend Engineer / Java Developer"
                    value={jobPosition}
                    required
                    onChange={(e) => {
                      setJobPosition(e.target.value);
                      setError("");
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Experience (Years)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="40"
                    className="rounded-xl glass-input text-sm"
                    value={jobExperience}
                    required
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
              </div>

              {/* Interview Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-500" />
                  Interview Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INTERVIEW_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = interviewType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setInterviewType(t.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border-cyan-400 text-white shadow-sm"
                            : "glass-card border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-cyan-400" : "text-slate-400"}`} />
                          <span className={isSelected ? "text-cyan-300 font-black" : "text-slate-700 dark:text-slate-200"}>{t.id}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Starting Difficulty & Question Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Starting Difficulty
                  </label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDifficulty(d.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          difficulty === d.id
                            ? `bg-white/10 font-black ${d.color}`
                            : "glass-card border-slate-200 dark:border-white/10 text-slate-500"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                    Number of Questions
                  </label>
                  <div className="flex gap-2">
                    {[3, 5, 7, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTotalQuestions(num)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          totalQuestions === num
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black"
                            : "glass-card border-slate-200 dark:border-white/10 text-slate-500"
                        }`}
                      >
                        {num} Qs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Company & Programming Language (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    Target Company (Optional)
                  </label>
                  <Input
                    className="rounded-xl glass-input text-sm"
                    placeholder="e.g. Google, Amazon, Microsoft, TCS, Startup"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                    Preferred Language (for coding)
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500/40 cursor-pointer"
                  >
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang} className="bg-slate-900 text-white">
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Resume / Project Context (Optional) */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Resume Highlights, Projects &amp; Tech Stack (Optional)
                </label>
                <Textarea
                  className="rounded-xl glass-input min-h-[80px] text-xs font-mono"
                  placeholder="Paste relevant projects, technologies or achievements. AI will generate targeted questions from them."
                  value={resumeContext}
                  onChange={(e) => setResumeContext(e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs px-6 py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Calibrating Adaptive Engine...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Start Adaptive Session
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewInterview;
