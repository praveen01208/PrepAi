"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Sparkles, Video, Mic, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Configure Your Target Role & Experience",
      desc: "Specify your desired role (e.g. Senior Frontend, Staff Backend, ML Engineer), your target tech stack, and your years of experience. Our Gemini engine immediately builds a custom tailored syllabus of questions with real interview rigor.",
      icon: BookOpen,
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      step: "02",
      title: "Audio & Webcam Readiness Check",
      desc: "Test your camera and microphone in the pre-interview staging room. We provide candidate tips and guidelines so you can enter the session calm and ready.",
      icon: Video,
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      step: "03",
      title: "Interactive Voice Mock Interview",
      desc: "Listen to the AI interviewer read out questions with text-to-speech. Speak your answers naturally. Our multimodal AI engine transcribes your voice in real time with high accuracy.",
      icon: Mic,
      gradient: "from-purple-600 to-pink-600",
    },
    {
      step: "04",
      title: "Granular Scoring & Actionable Feedback",
      desc: "Review your detailed 360° scorecard. See where you excelled, view ideal model answers, and get actionable suggestions to polish your technical and behavioral delivery.",
      icon: CheckCircle2,
      gradient: "from-emerald-600 to-teal-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Candidate Guidebook</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">How InterviewAI Works</h1>
          <p className="text-xs text-indigo-100 leading-relaxed">
            Our step-by-step roadmap to mastering technical interviews with personalized artificial intelligence.
          </p>
        </div>
      </div>

      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((s, index) => {
          const Icon = s.icon;
          return (
            <div
              key={index}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 relative group overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.gradient} text-white flex items-center justify-center font-black text-base shadow-md`}
                  >
                    {s.step}
                  </div>
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-snug">
                  {s.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h3>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Is my video or webcam stream recorded on the server?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No. Your camera preview runs strictly in your local browser window to simulate an authentic interview setting. We never record or upload your video.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              How does the audio transcription work?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When you click &ldquo;Record Answer&rdquo;, your speech is captured and transcribed with high accuracy via Gemini AI multimodal recognition.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Can I retake interviews to improve my score?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! All your mock interview sessions are saved in your dashboard history, and you can retake them anytime to practice your delivery and see your rating improve.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Action CTA */}
      <div className="flex justify-center pt-2">
        <Link href="/dashboard">
          <Button className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs px-8 py-4 shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <span>Start Practice Session Now</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;
