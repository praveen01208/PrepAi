"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Send,
  Cpu,
  Layers,
  Filter,
  Search,
  Zap,
  RotateCcw,
  Trophy,
  Star,
  ExternalLink,
  Tag,
  Clock,
  Check,
  ChevronRight,
  BookOpen,
  Building2,
  Flame,
  Award,
  Shuffle,
  Calendar,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  PROBLEMS,
  CATEGORIES,
  COMPANIES,
  getDailyProblem,
  getRandomProblem,
} from "./data/problems";

const LeetCodeArena = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProblem, setActiveProblem] = useState(null);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [userCode, setUserCode] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  // Daily Challenge state (not stored in DB, deterministically calculated or randomly picked)
  const [dailyProblem, setDailyProblem] = useState(() => getDailyProblem());
  const [isCustomRandom, setIsCustomRandom] = useState(false);

  const [solvedIds, setSolvedIds] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("prep_ai_solved_problems") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  const openProblemModal = (prob) => {
    setActiveProblem(prob);
    setUserCode(prob.starterCode[selectedLang] || prob.starterCode["javascript"] || "");
    setEvalResult(null);
  };

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    if (activeProblem?.starterCode?.[lang]) {
      setUserCode(activeProblem.starterCode[lang]);
    }
  };

  const handleShuffleRandomProblem = () => {
    const nextProb = getRandomProblem(dailyProblem?.id);
    setDailyProblem(nextProb);
    setIsCustomRandom(true);
    toast.info(`🎲 Picked: #${nextProb.number} ${nextProb.title}`);
  };

  const handleResetToDaily = () => {
    const todayProb = getDailyProblem();
    setDailyProblem(todayProb);
    setIsCustomRandom(false);
    toast.success("📅 Reset to official Daily Challenge");
  };

  const handleEvaluateSubmission = async () => {
    if (!userCode.trim()) {
      toast.warning("Please type your solution code first.");
      return;
    }
    try {
      setEvaluating(true);
      const res = await fetch("/api/leetcode/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: activeProblem.title,
          problemDesc: activeProblem.desc,
          language: selectedLang,
          userCode,
          constraints: activeProblem.constraints,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to evaluate code");

      setEvalResult(data);

      if (data.verdict === "Accepted") {
        toast.success(`🎉 Accepted! Score: ${data.score}/10`);
        const updated = Array.from(new Set([...solvedIds, activeProblem.id]));
        setSolvedIds(updated);
        localStorage.setItem("prep_ai_solved_problems", JSON.stringify(updated));
      } else {
        toast.error(`Verdict: ${data.verdict}`);
      }
    } catch (err) {
      toast.error(err.message || "Evaluation error.");
    } finally {
      setEvaluating(false);
    }
  };

  // Filter problems
  const filteredProblems = PROBLEMS.filter((p) => {
    const matchesCat = selectedCategory === "All Topics" || p.category === selectedCategory;
    const matchesComp = selectedCompany === "All Companies" || p.companies.includes(selectedCompany);
    const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesComp && matchesDiff && matchesSearch;
  });

  const totalEasy = PROBLEMS.filter((p) => p.difficulty === "Easy").length;
  const totalMed = PROBLEMS.filter((p) => p.difficulty === "Medium").length;
  const totalHard = PROBLEMS.filter((p) => p.difficulty === "Hard").length;

  const easySolved = solvedIds.filter((id) => PROBLEMS.find((p) => p.id === id)?.difficulty === "Easy").length;
  const medSolved = solvedIds.filter((id) => PROBLEMS.find((p) => p.id === id)?.difficulty === "Medium").length;
  const hardSolved = solvedIds.filter((id) => PROBLEMS.find((p) => p.id === id)?.difficulty === "Hard").length;

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner with LeetCode Style Scorecard */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-cyan-500/10 to-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>PREP-AI DSA &amp; LEETCODE ARENA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Competitive DSA &amp; Placement Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore {PROBLEMS.length} curated problems across 14 high-yield concepts asked in FAANG and campus placement drives. Write solutions from scratch with instant AI automated judging.
            </p>
          </div>

          {/* LeetCode Solved Progress Stats */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 shrink-0">
            <div className="flex flex-col items-center p-2 text-center">
              <span className="text-xs font-bold text-emerald-500 uppercase">Easy</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {easySolved} <span className="text-xs text-slate-400 font-normal">/ {totalEasy}</span>
              </span>
            </div>
            <div className="flex flex-col items-center p-2 text-center border-x border-slate-200 dark:border-white/10">
              <span className="text-xs font-bold text-amber-500 uppercase">Medium</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {medSolved} <span className="text-xs text-slate-400 font-normal">/ {totalMed}</span>
              </span>
            </div>
            <div className="flex flex-col items-center p-2 text-center">
              <span className="text-xs font-bold text-rose-500 uppercase">Hard</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {hardSolved} <span className="text-xs text-slate-400 font-normal">/ {totalHard}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DAILY SPOTLIGHT CHALLENGE CARD (NOT STORED IN DB) ================= */}
      {dailyProblem && (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {isCustomRandom ? "RANDOM PRACTICE SPOTLIGHT" : "DAILY LEETCODE CHALLENGE"}
                </span>
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {todayFormatted}
                </span>
                {isCustomRandom && (
                  <button
                    onClick={handleResetToDaily}
                    className="text-xs text-cyan-400 hover:underline font-bold"
                  >
                    (Reset to Today&apos;s Problem)
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-amber-400">#{dailyProblem.number}.</span> {dailyProblem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {dailyProblem.desc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                    dailyProblem.difficulty === "Easy"
                      ? "text-emerald-400 bg-emerald-500/15"
                      : dailyProblem.difficulty === "Medium"
                      ? "text-amber-400 bg-amber-500/15"
                      : "text-rose-400 bg-rose-500/15"
                  }`}
                >
                  {dailyProblem.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                  {dailyProblem.category}
                </span>
                <span className="text-slate-400 text-[11px] font-mono">
                  Acceptance: {dailyProblem.acceptance}
                </span>
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                  <span>• Asked by:</span>
                  <span className="text-slate-300 font-semibold">{dailyProblem.companies.slice(0, 3).join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <Button
                onClick={() => openProblemModal(dailyProblem)}
                className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-sm px-6 py-3 shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <Zap className="w-4 h-4 mr-1.5 fill-white" /> Solve Challenge
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleShuffleRandomProblem}
                className="rounded-2xl glass-card border border-white/20 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-white/10"
              >
                <Shuffle className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Pick Random Problem
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 space-y-4">
        {/* Search & Difficulty & Random Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem by name, topic, or concept..."
              className="pl-10 rounded-2xl glass-input text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDifficulty === d
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {d}
              </button>
            ))}

            <button
              onClick={handleShuffleRandomProblem}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold glass-card text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 flex items-center gap-1 transition"
            >
              <Shuffle className="w-3 h-3" /> Random
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                  : "glass-card text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problem List Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-xl">
        <div className="px-5 py-3.5 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
          <span>Showing {filteredProblems.length} of {PROBLEMS.length} Problems</span>
          <span>{solvedIds.length} Solved Overall</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200/60 dark:border-white/10">
              <tr>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Title</th>
                <th className="py-4 px-5">Topic</th>
                <th className="py-4 px-5">Difficulty</th>
                <th className="py-4 px-5">Companies</th>
                <th className="py-4 px-5">Acceptance</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {filteredProblems.map((prob) => {
                const isSolved = solvedIds.includes(prob.id);
                return (
                  <tr
                    key={prob.id}
                    className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => openProblemModal(prob)}
                  >
                    <td className="py-4 px-5">
                      {isSolved ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 block ml-1" />
                      )}
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition">
                      <span className="text-slate-400 mr-1.5">#{prob.number}.</span>
                      {prob.title}
                    </td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-300 font-medium">
                      {prob.category}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                          prob.difficulty === "Easy"
                            ? "text-emerald-400 bg-emerald-500/10"
                            : prob.difficulty === "Medium"
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-rose-400 bg-rose-500/10"
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {prob.companies.slice(0, 2).map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 text-[10px]"
                          >
                            {c}
                          </span>
                        ))}
                        {prob.companies.length > 2 && (
                          <span className="text-[10px] text-slate-400">+{prob.companies.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-400 font-mono">{prob.acceptance}</td>
                    <td className="py-4 px-5 text-right">
                      <Button
                        size="sm"
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-sm hover:scale-105 transition"
                      >
                        Solve <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LeetCode Interactive Code Workspace Dialog */}
      <Dialog open={!!activeProblem} onOpenChange={(open) => !open && setActiveProblem(null)}>
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] rounded-3xl p-0 overflow-y-auto lg:overflow-hidden glass-panel border border-white/60 dark:border-white/10 shadow-2xl">
          {activeProblem && (
            <div className="flex flex-col min-h-0 lg:h-[85vh]">
              {/* Top Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900/90 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    #{activeProblem.number}
                  </div>
                  <div>
                    <DialogTitle className="text-sm sm:text-lg font-black text-white">
                      {activeProblem.title}
                    </DialogTitle>
                    <DialogDescription className="text-[11px] sm:text-xs text-slate-400">
                      {activeProblem.category} • {activeProblem.difficulty} • {activeProblem.acceptance} Acceptance
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedLang}
                    onChange={(e) => handleLangChange(e.target.value)}
                    className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl glass-input text-slate-200 cursor-pointer"
                  >
                    <option value="javascript" className="bg-slate-900">JavaScript</option>
                    <option value="typescript" className="bg-slate-900">TypeScript</option>
                    <option value="python" className="bg-slate-900">Python</option>
                    <option value="java" className="bg-slate-900">Java</option>
                    <option value="cpp" className="bg-slate-900">C++</option>
                    <option value="go" className="bg-slate-900">Go</option>
                  </select>
                </div>
              </div>

              {/* Body: Split View (Problem Description Left + Code Editor Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-0 lg:overflow-hidden">
                {/* Left Description Pane */}
                <div className="lg:col-span-5 p-4 sm:p-6 lg:overflow-y-auto space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-white/10 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase text-[11px] mb-2">Description</h4>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
                      {activeProblem.desc}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-400 uppercase text-[11px]">Sample Examples</h4>
                    {activeProblem.examples.map((ex, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 font-mono text-[11px] space-y-1">
                        <div>
                          <span className="text-cyan-400 font-bold">Input:</span>{" "}
                          <span className="text-slate-800 dark:text-slate-200">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-emerald-400 font-bold">Output:</span>{" "}
                          <span className="text-slate-800 dark:text-slate-200">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-slate-500 text-[10px] pt-1 border-t border-white/5 font-sans">
                            <span className="font-bold">Explanation:</span> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase text-[11px] mb-1.5">Constraints</h4>
                    <p className="text-slate-400 font-mono text-[11px] p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-white/5">
                      {activeProblem.constraints}
                    </p>
                  </div>

                  {/* Top Companies */}
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Frequently Asked At
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProblem.companies.map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Code Editor & Result Pane */}
                <div className="lg:col-span-7 flex flex-col justify-between lg:overflow-hidden bg-slate-950 p-4 space-y-3 min-h-[380px] lg:min-h-0">
                  <div className="relative rounded-xl overflow-hidden glass-terminal border border-white/10 flex-1 flex flex-col min-h-[220px]">
                    <div className="px-4 py-2 bg-slate-900/80 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>solution.{selectedLang === "python" ? "py" : selectedLang === "java" ? "java" : selectedLang === "cpp" ? "cpp" : selectedLang === "go" ? "go" : selectedLang === "typescript" ? "ts" : "js"}</span>
                      <span className="text-cyan-400/80">Write your code inside the template</span>
                    </div>

                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      rows={14}
                      className="w-full flex-1 p-4 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none"
                      spellCheck={false}
                      placeholder="// Type your code here..."
                    />
                  </div>

                  {/* Verdict & Feedback Output */}
                  {evalResult && (
                    <div className="p-3.5 rounded-xl glass-card border border-white/10 space-y-2 animate-in fade-in duration-200 max-h-48 overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase ${
                              evalResult.verdict === "Accepted"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {evalResult.verdict}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            Cases: {evalResult.passedCases}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                          <span>Time: {evalResult.timeComplexity}</span>
                          <span>Space: {evalResult.spaceComplexity}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {evalResult.feedback}
                      </p>
                    </div>
                  )}

                  {/* Bottom Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserCode(activeProblem.starterCode[selectedLang] || activeProblem.starterCode["javascript"] || "")}
                      className="rounded-xl text-xs text-slate-400 hover:text-slate-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Template
                    </Button>

                    <Button
                      onClick={handleEvaluateSubmission}
                      disabled={evaluating}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white font-black text-xs px-6 py-2.5 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
                    >
                      {evaluating ? (
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 animate-spin" />
                          Running PREP-AI Judge...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5" /> Submit Solution
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeetCodeArena;
