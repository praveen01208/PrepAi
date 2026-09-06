"use client";

import React, { useState, createContext } from "react";
import { Toaster } from "@/components/ui/sonner";
import Header from "./_components/Header";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();

  const isFullWidth =
    pathname === "/dashboard/learn" ||
    pathname === "/dashboard/courses" ||
    pathname === "/dashboard/leetcode" ||
    pathname === "/dashboard/game";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 relative selection:bg-cyan-500/20 selection:text-cyan-400 w-full">
      <Toaster richColors position="top-right" />
      
      {/* Ambient Mesh Glows */}
      <div className="ambient-glow bg-cyan-500/20 w-[500px] h-[500px] -top-32 -left-32" />
      <div className="ambient-glow bg-indigo-500/20 w-[550px] h-[550px] top-1/3 -right-32" />
      <div className="ambient-glow bg-purple-500/15 w-[600px] h-[600px] -bottom-32 left-1/4" />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <Header />

      <main
        className={`w-full transition-all pt-6 pb-12 relative z-10 ${
          isFullWidth ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
