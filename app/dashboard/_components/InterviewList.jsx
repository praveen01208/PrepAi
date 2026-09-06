"use client";

import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Sparkles, BrainCircuit } from "lucide-react";

const InterviewList = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const [resLegacy, resAdaptive] = await Promise.allSettled([
        fetch("/api/interviews/list"),
        fetch("/api/interviews/adaptive/list")
      ]);

      let combined = [];

      if (resAdaptive.status === "fulfilled" && resAdaptive.value.ok) {
        const adaptiveData = await resAdaptive.value.json();
        if (Array.isArray(adaptiveData)) {
          const normalized = adaptiveData.map(a => ({
            id: a.id,
            mockId: a.sessionId,
            jobPosition: a.targetRole,
            jobDesc: `${a.interviewType} • ${a.currentDifficulty || a.initialDifficulty} Level`,
            jobExperience: a.experienceLevel,
            createdAt: a.createdAt?.split("T")[0] || "Recent",
            isAdaptive: true,
            score: a.overallScore
          }));
          combined = [...combined, ...normalized];
        }
      }

      if (resLegacy.status === "fulfilled" && resLegacy.value.ok) {
        const legacyData = await resLegacy.value.json();
        if (Array.isArray(legacyData)) {
          combined = [...combined, ...legacyData];
        }
      }

      setInterviewList(combined);
    } catch {
      // gracefully handle empty state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Interview History &amp; Reports
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          {interviewList.length} Sessions recorded
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 rounded-3xl glass-panel space-y-3">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : interviewList.length === 0 ? (
        <div className="p-8 rounded-3xl glass-panel border border-dashed text-center space-y-2">
          <BrainCircuit className="w-8 h-8 text-cyan-400 mx-auto opacity-75 animate-pulse" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No mock interviews recorded yet.
          </p>
          <p className="text-xs text-slate-500">
            Click &ldquo;+ Start Adaptive AI Mock Interview&rdquo; above to begin your first session!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
