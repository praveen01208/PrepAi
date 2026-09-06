"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-12">
      <div className="glass-panel rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-white">Temporary Session Issue</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error?.message || "An unexpected error occurred in this workspace. Please refresh or return to dashboard."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <Button
            onClick={() => reset ? reset() : window.location.reload()}
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full px-5 py-2 rounded-full glass-card border border-white/10 text-xs font-bold text-slate-200 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
