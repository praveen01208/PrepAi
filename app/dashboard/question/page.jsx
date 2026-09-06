"use client";

import React from "react";
import AddQuestions from "../_components/AddQuestions";
import QuestionList from "../_components/QuestionList";
import { BookOpen, HelpCircle, Sparkles, Building2, Layers } from "lucide-react";

const Questions = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>AI Practice Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Curated Interview Questions Bank
          </h1>
          <p className="text-xs text-indigo-100 leading-relaxed">
            Generate and practice targeted technical & behavioral questions tailored by company, domain, and experience level.
          </p>
        </div>
      </div>

      {/* Action Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AddQuestions />
      </div>

      {/* Previous Questions List */}
      <QuestionList />
    </div>
  );
};

export default Questions;