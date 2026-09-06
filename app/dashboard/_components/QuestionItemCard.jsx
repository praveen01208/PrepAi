"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Building2, Calendar, ArrowRight, BookOpen } from "lucide-react";

const QuestionItemCard = ({ question }) => {
  const router = useRouter();

  const onStart = () => {
    router.push("/dashboard/pyq/" + question?.mockId);
  };

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between group relative overflow-hidden">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-bold tracking-wide truncate max-w-[200px]">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{question?.company || "Tech Interview"}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
            {question?.jobExperience} Yrs Exp
          </span>
        </div>

        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
          {question?.jobPosition}
        </h4>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {question?.jobDesc}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {question?.createdAt || "Recent"}
        </span>

        <button
          onClick={onStart}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          <span>Practice Bank</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default QuestionItemCard;
