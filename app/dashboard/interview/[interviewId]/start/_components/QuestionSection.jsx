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
} from "lucide-react";
import { toast } from "sonner";

const QuestionSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const textToSpeech = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.95;
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

  if (!mockInterviewQuestion) return null;
  const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-6 min-h-[460px] border border-slate-200/80 dark:border-white/10 shadow-xl">
      <div className="space-y-5">
        {/* Question Selector Navigation Pills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Question Palette:
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {mockInterviewQuestion.map((_, index) => {
              const isCurrent = activeQuestionIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveQuestionIndex && setActiveQuestionIndex(index)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isCurrent
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-md shadow-indigo-500/30 scale-105"
                      : "glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                  }`}
                >
                  Q{index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question Text & Actions */}
        <div className="space-y-4 pt-2 border-t border-slate-200/60 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 dark:border-cyan-500/20">
                CHALLENGE #{activeQuestionIndex + 1}
              </span>
              <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                • Technical Assessment
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy Question */}
              <button
                onClick={() => copyQuestion(currentQuestion?.Question)}
                className="p-1.5 rounded-lg glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Copy Question"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Listen Voice */}
              <button
                onClick={() => textToSpeech(currentQuestion?.Question)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  isPlaying
                    ? "bg-cyan-500 text-slate-950 font-black animate-pulse"
                    : "bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-500/20 border border-indigo-500/20 dark:border-cyan-500/20"
                }`}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <h3 className="text-base sm:text-lg font-bold leading-relaxed text-slate-900 dark:text-white">
              {currentQuestion?.Question}
            </h3>
          </div>
        </div>
      </div>

      {/* Candidate Instruction & Advice */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-700 dark:text-indigo-200 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-cyan-400">
          <Lightbulb className="w-4 h-4 shrink-0" />
          <span>PREP-AI Analysis Tip</span>
        </div>
        <p className="leading-relaxed opacity-90">
          Provide your solution in the right editor. You can write algorithmic code or a structured technical explanation. PREP-AI will analyze correctness, Big-O efficiency, and trade-offs.
        </p>
      </div>
    </div>
  );
};

export default QuestionSection;
