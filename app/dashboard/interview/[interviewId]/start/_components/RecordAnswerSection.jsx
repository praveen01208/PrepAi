"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Code2,
  FileText,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Zap,
  Terminal,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "SQL", value: "sql" },
  { label: "Go", value: "go" },
  { label: "Text / Markdown", value: "text" },
];

const CODE_TEMPLATES = {
  javascript: `// Write your JavaScript solution here
function solution(input) {
  // Your code logic
  return null;
}`,
  typescript: `// Write your TypeScript solution here
function solution(input: any): any {
  // Your code logic
  return null;
}`,
  python: `# Write your Python solution here
def solution(input_data):
    # Your code logic
    pass`,
  java: `// Write your Java solution here
class Solution {
    public void solve() {
        // Your code logic
    }
}`,
  cpp: `// Write your C++ solution here
#include <iostream>

void solution() {
    // Your code logic
}`,
  sql: `-- Write your SQL query here
SELECT * 
FROM table_name 
WHERE condition;`,
  go: `// Write your Go solution here
package main

func solution() {
    // Your code logic
}`,
  text: `Explain your approach, architectural design, data structures used, and Big-O time/space complexity here...`,
};

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [activeTab, setActiveTab] = useState("code"); // "code" | "text"
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [answerInput, setAnswerInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);
  const textareaRef = useRef(null);

  const currentQ = mockInterviewQuestion?.[activeQuestionIndex];

  // Reset state on question change
  useEffect(() => {
    setAnswerInput("");
    setEvalResult(null);
    setShowIdealAnswer(false);
  }, [activeQuestionIndex]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "text") {
      setSelectedLanguage("text");
      if (!answerInput) setAnswerInput("");
    } else {
      if (selectedLanguage === "text") setSelectedLanguage("javascript");
      if (!answerInput) setAnswerInput(CODE_TEMPLATES["javascript"]);
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (!answerInput || Object.values(CODE_TEMPLATES).includes(answerInput)) {
      setAnswerInput(CODE_TEMPLATES[lang] || "");
    }
  };

  // Support Tab key indentation inside code editor
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = answerInput;
      setAnswerInput(val.substring(0, start) + "  " + val.substring(end));
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
    // Submit on Cmd+Enter / Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput || answerInput.trim().length < 5) {
      toast.warning("Please type a meaningful code solution or written answer first.");
      return;
    }
    if (!interviewData?.mockId || !currentQ) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/interviews/${interviewData.mockId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQ.Question,
          correctAns: currentQ.Answer,
          userAns: `[Mode: ${activeTab.toUpperCase()} | Lang: ${selectedLanguage}]\n${answerInput}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze answer");
      }

      setEvalResult({
        rating: data.rating,
        feedback: data.feedback,
      });
      toast.success("PREP-AI analysis complete!");
    } catch (err) {
      toast.error(err.message || "An error occurred while evaluating your answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-5 min-h-[460px] border border-slate-200/80 dark:border-white/10 shadow-xl">
      {/* Top Workspace Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-white/10">
        {/* Mode Selector */}
        <div className="flex items-center p-1 rounded-2xl glass-card border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => handleTabChange("code")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "code"
                ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Solution</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("text")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "text"
                ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Written Concept</span>
          </button>
        </div>

        {/* Language dropdown (if in code mode) */}
        {activeTab === "code" && (
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl glass-input text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.filter((l) => l.value !== "text").map((l) => (
              <option key={l.value} value={l.value} className="bg-slate-900 text-white">
                {l.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Code & Text Area */}
      <div className="relative rounded-2xl overflow-hidden glass-terminal border border-slate-700/80 dark:border-white/10 shadow-inner">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-white/5 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-slate-300 font-semibold">
              solution.{activeTab === "code" ? selectedLanguage : "md"}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Press Cmd + Enter to Analyze
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeTab === "code"
              ? "// Type or paste your code solution here...\n// Tab key indents by 2 spaces."
              : "Type your structured technical explanation, algorithm trade-offs, and design thoughts..."
          }
          rows={10}
          className="w-full p-4 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y min-h-[220px]"
          spellCheck={false}
        />
      </div>

      {/* Real-time Inline Feedback Result Card */}
      {evalResult && (
        <div className="p-4 sm:p-5 rounded-2xl glass-card border border-indigo-500/30 dark:border-cyan-500/30 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                PREP-AI Analysis
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 font-black text-xs border border-indigo-500/20 dark:border-cyan-500/20">
              Score: {evalResult.rating}/10
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-white/5">
            {evalResult.feedback}
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowIdealAnswer(!showIdealAnswer)}
              className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              {showIdealAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showIdealAnswer ? "Hide Ideal Solution" : "View Reference Solution"}</span>
            </button>
          </div>

          {showIdealAnswer && currentQ?.Answer && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1 animate-in fade-in">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block text-[10px]">
                Model Reference Answer:
              </span>
              <p className="text-slate-800 dark:text-emerald-100 leading-relaxed font-mono">
                {currentQ.Answer}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>{answerInput.length} chars</span>
          <span>•</span>
          <span>{answerInput.trim() ? answerInput.trim().split(/\s+/).length : 0} words</span>
        </div>

        <div className="flex items-center gap-2.5">
          {answerInput && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAnswerInput("")}
              className="rounded-xl text-xs text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}

          <Button
            type="button"
            disabled={loading || !answerInput.trim()}
            onClick={handleSubmitAnswer}
            className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-black text-xs px-6 py-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Solution...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Analyze with PREP-AI
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerSection;
