"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Code2,
  FileText,
  Mic,
  MicOff,
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
  StopCircle,
  Play,
  Volume2,
  ArrowRight,
  TrendingUp,
  BrainCircuit
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
];

const CODE_TEMPLATES = {
  javascript: `// Write your JavaScript solution / design here
function solution(input) {
  // Your code logic
  return null;
}`,
  typescript: `// Write your TypeScript solution / design here
function solution(input: any): any {
  // Your code logic
  return null;
}`,
  python: `# Write your Python solution / design here
def solution(input_data):
    # Your code logic
    pass`,
  java: `// Write your Java solution / design here
class Solution {
    public void solve() {
        // Your code logic
    }
}`,
  cpp: `// Write your C++ solution / design here
#include <iostream>

void solution() {
    // Your code logic
}`,
  sql: `-- Write your SQL query here
SELECT * 
FROM table_name 
WHERE condition;`,
  go: `// Write your Go solution / design here
package main

func solution() {
    // Your code logic
}`,
};

const RecordAnswerSection = ({
  mockInterviewQuestion = [],
  activeQuestionIndex = 0,
  interviewData,
  onAnswerEvaluated,
  currentDifficulty = "Intermediate"
}) => {
  const [activeTab, setActiveTab] = useState("voice"); // "voice" | "code" | "text"
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [answerInput, setAnswerInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);
  
  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  const currentQ = mockInterviewQuestion?.[activeQuestionIndex];

  // Reset answer when moving to a new question
  useEffect(() => {
    setAnswerInput("");
    setEvalResult(null);
    setShowIdealAnswer(false);
    stopRecording();
  }, [activeQuestionIndex]);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setActiveTab("text");
    }
    return () => stopRecording();
  }, []);

  // Voice recording handlers
  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Try Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    let baseText = answerInput;

    recognition.onstart = () => {
      setIsRecording(true);
      setInterimTranscript("");
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
      toast.success("🎙️ Recording started — speak your answer clearly!");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = baseText;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += (final ? " " : "") + t;
        } else {
          interim += t;
        }
      }
      baseText = final;
      setAnswerInput(final + (interim ? " " + interim : ""));
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech") {
        console.warn("Speech error:", event.error);
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        try { recognition.start(); } catch (_) {}
      }
    };

    recognition.start();
  }, [answerInput, isRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setInterimTranscript("");
  }, []);

  const handleTabChange = (tab) => {
    if (isRecording) stopRecording();
    setActiveTab(tab);
    if (tab === "code" && (!answerInput || answerInput.length < 10)) {
      setAnswerInput(CODE_TEMPLATES[selectedLanguage] || "");
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
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  const handleSubmitAnswer = async () => {
    if (isRecording) stopRecording();

    if (!answerInput || answerInput.trim().length < 5) {
      toast.warning("Please provide a meaningful voice, code, or written response first.");
      return;
    }

    const qText = currentQ?.questionText || currentQ?.Question;
    const qIdeal = currentQ?.idealAnswer || currentQ?.Answer || "";

    try {
      setLoading(true);

      const sessionId = interviewData?.sessionId || interviewData?.mockId;

      // Try adaptive next evaluation endpoint
      const res = await fetch("/api/interviews/adaptive/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionIndex: activeQuestionIndex,
          questionText: qText,
          idealAnswer: qIdeal,
          userResponse: answerInput,
          userResponseMode: activeTab,
          currentDifficulty,
          targetRole: interviewData?.targetRole || interviewData?.jobPosition || "Software Engineer",
          interviewType: interviewData?.interviewType || "Technical",
          totalQuestions: interviewData?.totalQuestions || 5,
          resumeContext: interviewData?.resumeContext || "",
          durationSeconds: recordingSeconds || 45
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze answer");
      }

      setEvalResult(data);

      const actionMsg =
        data.adaptiveAction === "escalate"
          ? "🚀 Strong answer! Difficulty escalated."
          : data.adaptiveAction === "simplify"
          ? "💡 Helpful pivot question generated."
          : "🎯 Follow-up question generated.";

      toast.success(actionMsg);

      // Notify parent component to update adaptive state / append next question
      if (onAnswerEvaluated) {
        onAnswerEvaluated(data);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while evaluating your answer.");
    } finally {
      setLoading(false);
    }
  };

  const formatSeconds = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-5 min-h-[500px] border border-slate-200/80 dark:border-white/10 shadow-xl">
      {/* Top Workspace Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-white/10">
        <div className="flex items-center p-1 rounded-2xl glass-card border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => handleTabChange("voice")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "voice"
                ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Mode</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("code")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "text"
                ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Written Concept</span>
          </button>
        </div>

        {activeTab === "code" && (
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl glass-input text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value} className="bg-slate-900 text-white">
                {l.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Voice Recorder Ribbon (if in voice mode) */}
      {activeTab === "voice" && (
        <div className={`p-4 rounded-2xl border transition-all ${
          isRecording ? "bg-rose-500/10 border-rose-500/30" : "bg-white/5 border-white/10"
        } flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30"
                  : "bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30"
              }`}
            >
              {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <div>
              <span className="text-xs font-bold text-white block">
                {isRecording ? "Listening & Transcribing..." : "Click Mic to Speak Answer"}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {isRecording ? `Recording: ${formatSeconds(recordingSeconds)}` : "Live filler word & pace analysis"}
              </span>
            </div>
          </div>

          {isRecording && (
            <div className="flex items-center gap-1">
              {[12, 24, 16, 28, 20, 14, 22].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-rose-400 rounded-full animate-pulse"
                  style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Code & Text Area */}
      <div className="relative rounded-2xl overflow-hidden glass-terminal border border-slate-700/80 dark:border-white/10 shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-white/5 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-slate-300 font-semibold">
              {activeTab === "code" ? `solution.${selectedLanguage}` : "candidate_answer.md"}
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
              : activeTab === "voice"
              ? "Your voice transcript will appear here in real-time as you speak...\nYou can also edit the text directly before submitting."
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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Action: {evalResult.adaptiveAction}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-black text-xs border border-cyan-500/20">
              Score: {evalResult.score}/100
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-white/5">
            {evalResult.feedback}
          </p>

          {/* Filler words & speech stats (if available) */}
          {evalResult.fillerAnalysis && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block font-medium">Filler Words:</span>
                <span className="font-bold text-amber-400">{evalResult.fillerAnalysis.totalFillers} detected</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block font-medium">Speaking Pace:</span>
                <span className="font-bold text-cyan-400">{evalResult.fillerAnalysis.wpm} WPM ({evalResult.fillerAnalysis.paceVerdict})</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block font-medium">Confidence:</span>
                <span className="font-bold text-emerald-400">{evalResult.confidenceRating || "Good"}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowIdealAnswer(!showIdealAnswer)}
              className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              {showIdealAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showIdealAnswer ? "Hide Reference Key Points" : "View Reference Key Points"}</span>
            </button>
          </div>

          {showIdealAnswer && (currentQ?.idealAnswer || currentQ?.Answer) && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1 animate-in fade-in">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block text-[10px]">
                Model Reference Answer:
              </span>
              <p className="text-slate-800 dark:text-emerald-100 leading-relaxed font-mono">
                {currentQ.idealAnswer || currentQ.Answer}
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
              onClick={() => {
                setAnswerInput("");
                setEvalResult(null);
              }}
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
                Evaluating &amp; Adapting Question...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                Submit for Adaptive AI Analysis
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerSection;
