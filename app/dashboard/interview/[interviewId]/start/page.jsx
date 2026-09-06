"use client";

import React, { useState, useEffect } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Terminal,
  BarChart3,
  Layers,
} from "lucide-react";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewDetails();
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interviews/${params.interviewId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMockInterviewQuestion(JSON.parse(data.jsonMockResp));
      setInterviewData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 text-slate-500">
        <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-sm font-semibold">Initializing PREP-AI Coding Studio...</span>
      </div>
    );
  }

  const totalQuestions = mockInterviewQuestion?.length || 5;
  const progressPercent = Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Top Header & Progress Bar */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200/80 dark:border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
              {interviewData?.jobPosition} • Challenge {activeQuestionIndex + 1} of {totalQuestions}
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Technical Assessment Session
            </h2>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="flex items-center gap-3 w-full sm:w-72">
          <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
            <div
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-black text-indigo-600 dark:text-cyan-400 shrink-0">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Main Responsive Grid: Question Left + Code/Answer Editor Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <QuestionSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
          />
        </div>

        <div className="lg:col-span-7">
          <RecordAnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
          />
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-white/10">
        <div>
          {activeQuestionIndex > 0 && (
            <Button
              variant="outline"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="rounded-2xl text-xs font-bold glass-card hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-1.5 px-4 py-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeQuestionIndex !== totalQuestions - 1 ? (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 px-5 py-2 shadow-md shadow-indigo-500/20"
            >
              Next Challenge <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Link href={"/dashboard/interview/" + interviewData?.mockId + "/feedback"}>
              <Button className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs font-black flex items-center gap-1.5 px-6 py-2 shadow-lg shadow-emerald-500/25">
                <CheckCircle className="w-4 h-4" /> Complete &amp; View Analysis
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
