"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Play, BarChart2, Calendar, Briefcase, ChevronRight, Terminal, Code2 } from "lucide-react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };

  const onFeedback = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between group relative overflow-hidden border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-cyan-400/50">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 text-xs font-bold tracking-wide truncate max-w-[210px] border border-indigo-500/20 dark:border-cyan-500/20">
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{interview?.jobPosition}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-lg shrink-0 border border-slate-200 dark:border-white/5">
            {interview?.jobExperience} Yrs Exp
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {interview?.jobDesc || "Technical questions & coding challenges."}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-200/60 dark:border-white/10">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-500" />
            {interview?.createdAt || "Recent"}
          </span>
          <span className="text-cyan-500 dark:text-cyan-400 font-semibold flex items-center gap-1">
            <Code2 className="w-3 h-3" /> 5 Challenges
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onFeedback}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold glass-card hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition"
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Analysis</span>
          </button>

          <button
            onClick={onStart}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewItemCard;