"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Code2,
  Terminal,
  Sparkles,
  HelpCircle,
  Flame,
  BrainCircuit,
  TrendingUp,
  RotateCcw,
  Tag
} from "lucide-react";
import { toast } from "sonner";

const DIFFICULTY_COLORS = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/20"
};

const QuestionSection = ({
  mockInterviewQuestion = [],
  activeQuestionIndex = 0,
  setActiveQuestionIndex,
  currentDifficulty = "Intermediate",
  interviewType = "Technical",
  targetRole = "Software Engineer",
  history = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentQuestion = mockInterviewQuestion[activeQuestionIndex] || {
    questionText: "Loading next adaptive challenge...",
    Question: "Loading next adaptive challenge..."
  };

  const questionContent = currentQuestion.questionText || currentQuestion.Question || "";
  const questionCategory = currentQuestion.category || interviewType || "Technical";
  const questionDiff = currentQuestion.difficultyLevel || currentDifficulty || "Intermediate";
  const generatedFrom = currentQuestion.generatedFrom || "Adaptive";

  const textToSpeech = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.95;
      speech.pitch = 1.0;
      speech.onend = () => setIsPlaying(false);
      speech.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(speech);
    } else {
      toast.info("Browser text-to-speech is not supported on this device.");
    }
  };

  const copyQuestion = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Question copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-6 min-h-[500px] border border-slate-200/80 dark:border-white/10 shadow-xl">
      <div className="space-y-5">
        {/* Dynamic Question Palette */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" /> Question Palette:
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${DIFFICULTY_COLORS[questionDiff] || DIFFICULTY_COLORS.Intermediate}`}>
                {questionDiff} Level
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Q{activeQuestionIndex + 1} of {Math.max(mockInterviewQuestion.length, activeQuestionIndex + 1)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {mockInterviewQuestion.map((q, index) => {
              const isCurrent = activeQuestionIndex === index;
              const isAnswered = q.userResponse || (history && history[index]);
              const qScore = q.score || history?.[index]?.score;

              return (
                <button
                  key={index}
                  onClick={() => setActiveQuestionIndex && setActiveQuestionIndex(index)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-md shadow-indigo-500/30 scale-105"
                      : isAnswered
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                      : "glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                  }`}
                >
                  <span>Q{index + 1}</span>
                  {qScore && <span className="text-[10px] opacity-80">({qScore})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question Text & Audio Actions */}
        <div className="space-y-4 pt-2 border-t border-slate-200/60 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 dark:border-cyan-500/20">
                CHALLENGE #{activeQuestionIndex + 1}
              </span>
              <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                • {questionCategory}
              </span>
              {generatedFrom !== "Initial" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                  {generatedFrom}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Copy Question */}
              <button
                onClick={() => copyQuestion(questionContent)}
                className="p-1.5 rounded-lg glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Copy Question"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Text to Speech Button */}
              <button
                onClick={() => textToSpeech(questionContent)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  isPlaying
                    ? "bg-cyan-500 text-slate-950 font-black animate-pulse"
                    : "bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-500/20 border border-indigo-500/20 dark:border-cyan-500/20"
                }`}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> Stop Voice
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> Repeat Audio
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-3">
            <h3 className="text-base sm:text-lg font-bold leading-relaxed text-slate-900 dark:text-white">
              {questionContent}
            </h3>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-cyan-400" /> {targetRole}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-purple-400" /> Adaptive Progression</span>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Coaching Advice Tip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 text-xs text-slate-700 dark:text-indigo-200 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-cyan-400">
          <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>PREP-AI Adaptive Advice</span>
        </div>
        <p className="leading-relaxed opacity-90 text-[11px]">
          Answer using Voice or Code/Text on the right. If you give a strong answer, PREP-AI will increase difficulty to probe your depth. If you struggle, it will guide you with a simpler follow-up.
        </p>
      </div>
    </div>
  );
};

export default QuestionSection;
