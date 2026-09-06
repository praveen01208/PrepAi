"use client";

import React, { useState, useRef } from "react";
import {
  FileText, Upload, Sparkles, CheckCircle2, AlertCircle, XCircle,
  TrendingUp, Target, Zap, ChevronRight, ArrowLeft, BarChart3,
  AlertTriangle, Star, Lightbulb, RefreshCw, Briefcase, Code2,
  BrainCircuit, Layers, Award, Play, Check, Copy, Building2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const TARGET_ROLES = [
  "Full Stack Developer",
  "Java Backend Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "Software Development Engineer (SDE)",
  "AI / ML Engineer",
  "Data Analyst",
  "DevOps Engineer"
];

const ScoreGauge = ({ score, label, color = "#22d3ee", sublabel }) => (
  <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl glass-card border border-white/10 text-center min-w-[120px] flex-1">
    <div className="text-2xl font-black" style={{ color }}>{score}/100</div>
    <div className="text-xs font-bold text-white">{label}</div>
    {sublabel && <div className="text-[10px] text-slate-400">{sublabel}</div>}
  </div>
);

export default function ResumeAnalyzerPage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [startingInterview, setStartingInterview] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();

  // Multi-format file uploader (PDF, DOCX, TXT)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setResumeText(ev.target.result);
        toast.success(`Loaded text file: ${file.name}`);
      };
      reader.readAsText(file);
    } else if (fileName.endsWith(".pdf") || fileName.endsWith(".docx")) {
      // For PDF / Word files in browser, read arrayBuffer or text representation
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const buffer = ev.target.result;
          // Extract readable ASCII/Unicode text chunks from buffer
          const decoder = new TextDecoder("utf-8", { fatal: false });
          const decoded = decoder.decode(buffer);
          // Filter readable words
          const cleanText = decoded
            .replace(/[^\x20-\x7E\t\n\r]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          
          if (cleanText.length > 100) {
            setResumeText(cleanText);
            toast.success(`Extracted content from ${file.name}`);
          } else {
            toast.info(`Uploaded ${file.name}. Please confirm or paste your resume text if parsing was partial.`);
          }
        } catch (err) {
          toast.warning("Could not extract binary PDF text. Please paste text directly.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Please upload a .pdf, .docx, or .txt file");
    }
  };

  const analyze = async () => {
    if (!resumeText.trim()) {
      toast.error("Please paste your resume text or upload a resume file first");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetRole,
          fileName: uploadedFileName || "resume.pdf"
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze");
      setResult(data);
      toast.success("Resume analysis & ATS breakdown complete!");
    } catch (e) {
      toast.error(e.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  // One-click action to start an adaptive mock interview seeded with resume projects
  const startResumeInterview = async () => {
    try {
      setStartingInterview(true);
      const projectHighlights = result?.projects
        ?.map(p => `${p.name}: ${p.technologies?.join(", ")} - ${p.description}`)
        .join("\n") || resumeText.substring(0, 1000);

      const res = await fetch("/api/interviews/adaptive/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          experienceLevel: "2",
          interviewType: "Resume-Based",
          initialDifficulty: "Intermediate",
          totalQuestions: 5,
          resumeContext: `CANDIDATE RESUME PROJECTS & SKILLS:\n${projectHighlights}`
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start interview");

      toast.success("Resume-Based Adaptive Interview initialized!");
      router.push(`/dashboard/interview/${data.sessionId}/start`);
    } catch (err) {
      toast.error(err.message || "Failed to launch interview");
    } finally {
      setStartingInterview(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Ambient Glows */}
      <div className="ambient-glow bg-emerald-500/15 w-[450px] h-[450px] -top-20 -left-20" />
      <div className="ambient-glow bg-cyan-500/15 w-[400px] h-[400px] top-1/3 -right-20" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-xl glass-card border border-white/10 hover:border-cyan-500/30 transition-all text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">AI Resume Analyzer &amp; ATS Engine</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">Extract skills &amp; projects, benchmark against roles, and generate resume-based interview questions</p>
          </div>
        </div>

        {result && (
          <Button
            onClick={startResumeInterview}
            disabled={startingInterview}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-xs px-5 py-2.5 shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-105 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{startingInterview ? "Launching..." : "Start Resume Mock Interview"}</span>
          </Button>
        )}
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-white block">Resume Content</label>
                <span className="text-xs text-slate-400">Upload your resume (PDF, DOCX, TXT) or paste text below</span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all font-bold"
              >
                <Upload className="w-3.5 h-3.5" /> Upload File (PDF / DOCX)
              </button>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileUpload} />
            </div>

            {uploadedFileName && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Uploaded: <strong className="text-white">{uploadedFileName}</strong></span>
              </div>
            )}

            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume text here — work experience, projects, skills, education..."
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 resize-none font-mono leading-relaxed transition-all"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{resumeText.length} characters • {resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0} words</span>
              {resumeText && (
                <button onClick={() => setResumeText("")} className="hover:text-red-400 transition">Clear Text</button>
              )}
            </div>
          </div>
        </div>

        {/* Configuration Right Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4 shadow-xl">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Target Job Role</label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:border-cyan-500/40 cursor-pointer"
              >
                {TARGET_ROLES.map(r => (
                  <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 text-xs text-slate-400 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> ATS Compatibility &amp; Quality Scoring</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Categorized Skills (Languages, DBs, Cloud)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Missing Skills vs Target Role Gap</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Project-Based Question Generation</div>
            </div>

            <Button
              onClick={analyze}
              disabled={loading || !resumeText.trim()}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.01] transition"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Resume &amp; ATS Score...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Analyze Resume with PREP-AI
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* ATS & Overall Breakdown Bento */}
          <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-7 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" /> AI Resume Assessment
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Overall ATS &amp; Role Fit Breakdown
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={startResumeInterview}
                  disabled={startingInterview}
                  className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs px-5 py-2 shadow-lg shadow-indigo-500/25 flex items-center gap-1.5"
                >
                  <BrainCircuit className="w-4 h-4" /> Practice Interview for this Resume
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <ScoreGauge score={result.overallScore || 78} label="Overall" color="#22d3ee" sublabel="Quality Assessment" />
              <ScoreGauge score={result.atsScore || 74} label="ATS Score" color="#34d399" sublabel="Keyword Match" />
              <ScoreGauge score={result.skillsScore || 82} label="Skills" color="#a78bfa" sublabel="Tech Stack Depth" />
              <ScoreGauge score={result.projectScore || 80} label="Projects" color="#f59e0b" sublabel="Complexity & Scope" />
              <ScoreGauge score={result.formattingScore || 88} label="Formatting" color="#60a5fa" sublabel="Readability" />
              <ScoreGauge score={result.roleMatchScore || 80} label="Role Match" color="#f43f5e" sublabel={`For ${targetRole}`} />
            </div>

            {result.summary && (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/5 rounded-2xl p-4 border border-white/10">
                {result.summary}
              </p>
            )}
          </div>

          {/* Categorized Skills Pills */}
          {result.categorizedSkills && (
            <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" /> Extracted Skills by Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {Object.entries(result.categorizedSkills).map(([cat, skills]) => {
                  if (!Array.isArray(skills) || skills.length === 0) return null;
                  return (
                    <div key={cat} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="font-bold text-slate-300 capitalize text-xs block">{cat}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Role Skills Gap Comparison: Strong vs Missing Skills */}
          {result.roleComparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass-panel rounded-3xl border border-emerald-500/20 p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Strong Demonstrated Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.roleComparison.strongSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-3xl border border-rose-500/20 p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" /> Missing Skills for {targetRole}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.roleComparison.missingSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tailored Resume-Based Interview Questions */}
          {result.resumeInterviewQuestions && result.resumeInterviewQuestions.length > 0 && (
            <div className="glass-panel rounded-3xl border border-indigo-500/30 p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4" /> AI Generated Questions from Your Projects
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Questions Interviewers Will Ask You About This Resume
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {result.resumeInterviewQuestions.map((qObj, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 inline-block">
                        {qObj.focus || "Project Depth"}
                      </span>
                      <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                        {qObj.question}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority Improvements & Missing Keywords */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {result.improvements?.length > 0 && (
              <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Actionable Resume Enhancements
                </h3>
                <div className="space-y-3">
                  {result.improvements.map((imp, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{imp.issue}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-400">
                          {imp.priority} Priority
                        </span>
                      </div>
                      <p className="text-slate-400">{imp.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.missingKeywords?.length > 0 && (
              <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" /> Recommended ATS Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                      + {kw}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Integrating these keywords into your project bullet points will increase ATS parser score and search visibility for {targetRole}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
