"use client";

import React, { useState, useEffect } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Terminal,
  BrainCircuit,
  Flame,
  Layers,
  StopCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

const StartInterview = ({ params }) => {
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [questionsList, setQuestionsList] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState("Intermediate");
  const [history, setHistory] = useState([]);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [params.interviewId]);

  const fetchSession = async () => {
    try {
      setLoading(true);

      // Check sessionStorage for cached initial question
      let cachedQuestion = null;
      let cachedSess = null;
      if (typeof window !== "undefined") {
        try {
          const qStr = sessionStorage.getItem("prep_ai_init_q_" + params.interviewId);
          if (qStr) cachedQuestion = JSON.parse(qStr);
          const sStr = sessionStorage.getItem("prep_ai_init_sess_" + params.interviewId);
          if (sStr) cachedSess = JSON.parse(sStr);
        } catch (_) {}
      }

      if (cachedSess) {
        setInterviewData(cachedSess);
        setCurrentDifficulty(cachedSess.currentDifficulty || cachedSess.initialDifficulty || "Intermediate");
      }

      // Try adaptive endpoint first
      const resAdaptive = await fetch(`/api/interviews/adaptive/${params.interviewId}`);
      if (resAdaptive.ok) {
        const data = await resAdaptive.json();
        if (data && data.session) {
          setInterviewData(data.session);
          setCurrentDifficulty(data.session.currentDifficulty || data.session.initialDifficulty || "Intermediate");
          
          if (data.questions && data.questions.length > 0) {
            setQuestionsList(data.questions);
            const lastUnanswered = data.questions.findIndex(q => !q.userResponse);
            setActiveQuestionIndex(lastUnanswered >= 0 ? lastUnanswered : data.questions.length - 1);
            setLoading(false);
            return;
          }
        }
      }

      // If cached question was found, use it
      if (cachedQuestion) {
        setQuestionsList([cachedQuestion]);
        setActiveQuestionIndex(0);
        setLoading(false);
        return;
      }

      // Legacy fallback
      const resLegacy = await fetch(`/api/interviews/${params.interviewId}`);
      if (resLegacy.ok) {
        const data = await resLegacy.json();
        if (data.jsonMockResp) {
          const parsed = JSON.parse(data.jsonMockResp);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestionsList(parsed);
            setInterviewData(data);
            setLoading(false);
            return;
          }
        }
      }

      // Default opening question fallback
      const defaultQ = {
        questionText: `Walk me through the architecture and design decisions of a key production application you built. How did you structure your components, APIs, and data storage for performance and reliability?`,
        category: "Technical",
        difficultyLevel: "Intermediate",
        generatedFrom: "Initial",
        idealAnswer: "Cover high-level architecture, frontend/backend separation, caching strategies, database optimization, and structured error handling."
      };
      setQuestionsList([defaultQ]);
      setActiveQuestionIndex(0);
    } catch (err) {
      console.error(err);
      // Ensure UI is never stuck
      const fallbackQ = {
        questionText: `Explain how you diagnose and resolve performance bottlenecks, high memory consumption, and slow API endpoints in your primary tech stack.`,
        category: "Technical",
        difficultyLevel: "Intermediate",
        generatedFrom: "Initial",
        idealAnswer: "Use performance profiling, database index analysis, caching with Redis, asynchronous queues, and load testing."
      };
      setQuestionsList([fallbackQ]);
      setActiveQuestionIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerEvaluated = (evalData) => {
    // Record in local history
    const updatedHistory = [...history];
    updatedHistory[activeQuestionIndex] = {
      score: evalData.score,
      action: evalData.adaptiveAction,
      feedback: evalData.feedback
    };
    setHistory(updatedHistory);

    if (evalData.nextDifficulty) {
      setCurrentDifficulty(evalData.nextDifficulty);
    }

    if (evalData.isFinalQuestion) {
      setIsSessionCompleted(true);
      toast.success("All questions completed! Generating 360° Performance Report...");
      setTimeout(() => {
        router.push(`/dashboard/interview/${params.interviewId}/feedback`);
      }, 1800);
      return;
    }

    // Append next adaptive question if not already in list
    if (evalData.nextQuestion) {
      setQuestionsList(prev => {
        const nextIdx = activeQuestionIndex + 1;
        if (prev[nextIdx]) {
          const updated = [...prev];
          updated[nextIdx] = evalData.nextQuestion;
          return updated;
        }
        return [...prev, evalData.nextQuestion];
      });
      // Move to next question after brief celebration delay
      setTimeout(() => {
        setActiveQuestionIndex(activeQuestionIndex + 1);
      }, 1200);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 text-slate-500">
        <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-sm font-semibold">Initializing PREP-AI Adaptive Studio...</span>
      </div>
    );
  }

  const totalQuestions = interviewData?.totalQuestions || questionsList.length || 5;
  const progressPercent = Math.min(Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100), 100);
  const targetRole = interviewData?.targetRole || interviewData?.jobPosition || "Software Engineer";
  const interviewType = interviewData?.interviewType || "Technical";

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Top Header & Adaptive Status Bar */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200/80 dark:border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                {targetRole} • Question {activeQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 animate-pulse">
                {currentDifficulty} Mode
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              Adaptive {interviewType} Assessment
            </h2>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="flex items-center gap-3 w-full sm:w-72">
          <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
            <div
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-black text-indigo-600 dark:text-cyan-400 shrink-0">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Main Responsive Grid: Question Left + Code/Voice/Answer Editor Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <QuestionSection
            mockInterviewQuestion={questionsList}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            currentDifficulty={currentDifficulty}
            interviewType={interviewType}
            targetRole={targetRole}
            history={history}
          />
        </div>

        <div className="lg:col-span-7">
          <RecordAnswerSection
            mockInterviewQuestion={questionsList}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={{
              sessionId: params.interviewId,
              mockId: params.interviewId,
              targetRole,
              interviewType,
              totalQuestions,
              resumeContext: interviewData?.resumeContext
            }}
            currentDifficulty={currentDifficulty}
            onAnswerEvaluated={handleAnswerEvaluated}
          />
        </div>
      </div>

      {/* Bottom Navigation & Finish Session Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-white/10">
        <div>
          {activeQuestionIndex > 0 && (
            <Button
              variant="outline"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="rounded-2xl text-xs font-bold glass-card hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-1.5 px-4 py-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Question
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeQuestionIndex < questionsList.length - 1 && (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 px-5 py-2 shadow-md shadow-indigo-500/20"
            >
              Next Challenge <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          <Link href={`/dashboard/interview/${params.interviewId}/feedback`}>
            <Button className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black flex items-center gap-1.5 px-6 py-2 shadow-lg shadow-emerald-500/25">
              <CheckCircle className="w-4 h-4" /> Finish &amp; View 360° Report
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
