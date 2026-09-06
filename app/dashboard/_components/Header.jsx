"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Bot,
  LayoutDashboard,
  HelpCircle,
  Gamepad2,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Zap,
  Code2,
} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "LeetCode Arena", href: "/dashboard/leetcode", icon: Code2 },
    { name: "Resume ATS", href: "/dashboard/resume", icon: BookOpen },
    { name: "Skill Gap", href: "/dashboard/skillgap", icon: Zap },
    { name: "Communication", href: "/dashboard/communication", icon: HelpCircle },
    { name: "Job Tracker", href: "/dashboard/jobs", icon: Gamepad2 },
  ];

  return (
    <div className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 pointer-events-none flex justify-center">
      <header className="pointer-events-auto max-w-5xl w-full dynamic-island rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2.5 transition-all duration-300">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo - Dynamic Island Capsule */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 group-hover:shadow-cyan-400/40 transition-all">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm sm:text-base tracking-wider text-slate-900 dark:text-white">
                PREP<span className="text-cyan-500 dark:text-cyan-400">-AI</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
            </div>
          </Link>

          {/* Center Navigation Pills (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/10 backdrop-blur-md">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-white dark:bg-white/15 text-indigo-600 dark:text-cyan-300 shadow-md shadow-black/5 dark:shadow-cyan-500/10 scale-105"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Island Capsule */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ModeToggle />

            <SignedIn>
              <div className="flex items-center pl-1 border-l border-slate-200 dark:border-white/10">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-cyan-500/40 rounded-full shadow-sm",
                    },
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-90 transition shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            {/* Mobile Island Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Island Expandable Mobile Tray */}
        {isOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200/60 dark:border-white/10 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-600 dark:text-cyan-300 border border-indigo-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
