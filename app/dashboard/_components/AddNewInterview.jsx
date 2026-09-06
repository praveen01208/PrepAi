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
} from "lucide-react";
import { useRouter } from "next/navigation";

const PRESETS = [
  {
    role: "Frontend Engineer",
    desc: "React, Next.js, TypeScript, Tailwind CSS, State Management, DOM & Performance",
    exp: "3",
  },
  {
    role: "Full Stack Developer",
    desc: "React, Node.js, Express, PostgreSQL, Prisma/Drizzle, REST & GraphQL APIs, Docker",
    exp: "4",
  },
  {
    role: "Backend Engineer",
    desc: "Python, FastAPI, Redis, Microservices, System Architecture, SQL Performance, Kafka",
    exp: "5",
  },
  {
    role: "Data Structures & Algorithms",
    desc: "Arrays, Trees, Dynamic Programming, Graphs, Big-O Complexity, LeetCode Patterns",
    exp: "2",
  },
];

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const applyPreset = (preset) => {
    setJobPosition(preset.role);
    setJobDesc(preset.desc);
    setJobExperience(preset.exp);
    setError("");
  };

  const clearForm = () => {
    setJobPosition("");
    setJobDesc("");
    setJobExperience("");
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPosition, jobDesc, jobExperience }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create interview. Please try again.");
        return;
      }

      setOpenDialog(false);
      clearForm();
      router.push("/dashboard/interview/" + data.mockId);
    } catch {
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
        className="group relative overflow-hidden rounded-3xl p-6 glass-card border border-dashed border-indigo-400/40 dark:border-indigo-500/30 hover:border-indigo-500 dark:hover:border-cyan-400 hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[180px]"
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-md">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 dark:border-cyan-500/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Powered
          </span>
        </div>

        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
            + New Technical &amp; Coding Session
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Specify job role, tech stack &amp; experience to synthesize questions
          </p>
        </div>
      </div>

      {/* Modern Glass Modal Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl w-[95vw] rounded-3xl p-0 overflow-hidden glass-panel border border-white/60 dark:border-white/10 shadow-2xl">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 p-6 sm:p-7 text-white border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
              <Terminal className="w-4 h-4" /> PREP-AI Question Generator
            </div>
            <DialogTitle className="text-2xl font-black text-white">
              Configure Practice Session
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs mt-1">
              PREP-AI will synthesize targeted technical questions and evaluation rubrics for your profile.
            </DialogDescription>
          </div>

          <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
            {/* Quick Presets */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Quick Role Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="text-xs font-medium px-3.5 py-1.5 rounded-xl glass-card hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-white/10 transition-all text-slate-700 dark:text-slate-200"
                  >
                    {p.role}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  Target Role / Position
                </label>
                <Input
                  className="rounded-xl glass-input text-sm"
                  placeholder="e.g. Senior Frontend Engineer"
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
                  <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                  Tech Stack &amp; Focus Areas (Comma separated)
                </label>
                <Textarea
                  className="rounded-xl glass-input min-h-[90px] text-sm"
                  placeholder="e.g. React 18, Next.js 14, TypeScript, Tailwind, Algorithms, System Design"
                  value={jobDesc}
                  required
                  onChange={(e) => {
                    setJobDesc(e.target.value);
                    setError("");
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  Years of Relevant Experience
                </label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  className="rounded-xl glass-input text-sm"
                  placeholder="e.g. 3"
                  value={jobExperience}
                  required
                  onChange={(e) => {
                    setJobExperience(e.target.value);
                    setError("");
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => {
                    setOpenDialog(false);
                    clearForm();
                  }}
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
                      Synthesizing Questions...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate &amp; Start Session
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
