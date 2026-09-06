"use client"

import * as React from "react"
import { Moon, Sparkles } from "lucide-react"

export function ModeToggle() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold backdrop-blur-md shadow-sm shadow-cyan-500/10">
      <Moon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
      <span className="hidden sm:inline font-mono text-[11px] tracking-wide">DARK GLASS</span>
      <Sparkles className="w-3 h-3 text-purple-400" />
    </div>
  )
}
