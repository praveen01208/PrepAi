"use client";

import React from "react";
import PricingPlan from "../_components/PricingPlan";
import { useUser } from "@clerk/nextjs";
import { Sparkles, Check, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Upgrade = () => {
  const { user } = useUser();

  const plans = [
    {
      name: "Starter Practice",
      price: "Free",
      period: "Forever",
      desc: "Perfect for getting familiar with AI mock interviews",
      features: [
        "Unlimited standard mock sessions",
        "Gemini speech transcription",
        "360° answer scoring & feedback",
        "Public question banks",
      ],
      current: true,
    },
    {
      name: "Pro Candidate",
      price: "$9.99",
      period: "per month",
      desc: "For serious candidates aiming for top-tier tech offers",
      features: [
        "Everything in Free tier",
        "Advanced System Design scenarios",
        "Company-specific question generators (FAANG / Fortune 500)",
        "Priority Gemini AI processing speed",
        "Full interview history & trend analytics",
      ],
      popular: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-yellow-300" />
            <span>InterviewAI Membership</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Upgrade Your Interview Prep</h1>
          <p className="text-xs text-purple-100 leading-relaxed">
            Unlock advanced scenario generators, company-specific question tracks, and deep speech analytics.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 flex flex-col justify-between relative ${
              p.popular
                ? "glass-panel border-2 border-indigo-500 shadow-xl shadow-indigo-500/10"
                : "glass-panel border border-slate-200/80 dark:border-slate-800"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-[11px] font-bold shadow-md">
                MOST POPULAR
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {p.desc}
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                  {p.price}
                </span>
                <span className="text-xs text-slate-500 font-medium">/{p.period}</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              {p.current ? (
                <Button
                  disabled
                  variant="outline"
                  className="w-full rounded-2xl text-xs font-bold py-5"
                >
                  Current Active Plan
                </Button>
              ) : (
                <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs py-5 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition">
                  <Zap className="w-3.5 h-3.5 mr-1.5" /> Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upgrade;
