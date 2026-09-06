"use client";

import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Sparkles } from "lucide-react";

const InterviewList = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/interviews/list");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInterviewList(data);
    } catch {
      // silently fail — user just won't see the list
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
            Previous Mock Interviews
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          {interviewList.length} Sessions saved
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
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto opacity-75" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No mock interviews found yet.
          </p>
          <p className="text-xs text-slate-500">
            Click &ldquo;+ Create New Mock Interview&rdquo; above to get started!
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
