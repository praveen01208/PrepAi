"use client";

import React, { useEffect, useState } from "react";
import QuestionItemCard from "./QuestionItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Layers, Sparkles } from "lucide-react";

const QuestionList = () => {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetQuestionList();
  }, []);

  const GetQuestionList = async () => {
    try {
      const res = await fetch("/api/questions/list");
      if (!res.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await res.json();
      setQuestionList(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load previous mock questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Generated Question Banks
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          {questionList.length} Sets available
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
      ) : questionList.length === 0 ? (
        <div className="p-8 rounded-3xl glass-panel border border-dashed text-center space-y-2">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto opacity-75" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No question banks created yet.
          </p>
          <p className="text-xs text-slate-500">
            Click &ldquo;+ Generate Question Set&rdquo; above to create one for any company!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {questionList.map((question, index) => (
            <QuestionItemCard key={index} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
