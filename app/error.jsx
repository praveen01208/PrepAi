"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Bot } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Mesh */}
      <div className="ambient-glow bg-cyan-500/20 w-[500px] h-[500px] -top-32 -left-32" />
      <div className="ambient-glow bg-red-500/15 w-[500px] h-[500px] top-1/3 -right-32" />

      <div className="relative z-10 max-w-lg w-full glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            <Bot className="w-3.5 h-3.5" />
            <span>PREP-AI RESILIENCE ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Something went wrong</h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {error?.message || "An unexpected error occurred while rendering this page."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset ? reset() : window.location.reload()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-indigo-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full px-6 py-2.5 rounded-full glass-card border border-white/10 text-xs font-bold text-slate-200 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
