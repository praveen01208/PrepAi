"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  PlayCircle,
  Sparkles,
  CheckCircle2,
  Trophy,
  Star,
  Clock,
  Video,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Building2,
  Cpu,
  Flame,
  Award,
  BookMarked,
  X,
  Tv,
  Play,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Curated Placement & Engineering Courses with verified YouTube Playlists and Video IDs
const COURSES = [
  {
    id: "dsa-placement",
    title: "Complete DSA & SDE Placement Masterclass",
    instructor: "Striver (take U-forward)",
    category: "Data Structures & Algorithms",
    level: "Beginner to Advanced",
    duration: "48 Hours • 180+ Lessons",
    rating: 4.9,
    students: "142k enrolled",
    badge: "Most Popular",
    heroVideoId: "FPu9Uld7W-E",
    thumbnail: "https://img.youtube.com/vi/FPu9Uld7W-E/hqdefault.jpg",
    ytPlaylistId: "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_st8",
    desc: "Complete step-by-step roadmap covering Arrays, Strings, Two Pointers, Linked Lists, Trees, Graphs, DP, and Bit Manipulation with LeetCode solutions.",
    modules: [
      { title: "Basics of C++ / Java & Time Complexity (Big-O)", duration: "45 mins", ytUrl: "https://youtu.be/FPu9Uld7W-E", videoId: "FPu9Uld7W-E" },
      { title: "Arrays & Dynamic Hashing Fundamentals", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/37E9ckMDdTk", videoId: "37E9ckMDdTk" },
      { title: "Binary Search on 1D/2D Arrays & Answer Spaces", duration: "1 hr 40 mins", ytUrl: "https://youtu.be/W9QJ8HaRnSw", videoId: "W9QJ8HaRnSw" },
      { title: "Recursion & Backtracking (Subsets, N-Queens)", duration: "2 hrs", ytUrl: "https://youtu.be/yVdKa8dnKiE", videoId: "yVdKa8dnKiE" },
      { title: "Binary Trees & BST Traversals & Views", duration: "2 hrs 30 mins", ytUrl: "https://youtu.be/_ANrF3FJm7I", videoId: "_ANrF3FJm7I" },
      { title: "Dynamic Programming: 1D, 2D, Knapsack & Stocks", duration: "3 hrs 15 mins", ytUrl: "https://youtu.be/tyB0ztf0DNY", videoId: "tyB0ztf0DNY" },
      { title: "Graphs: BFS, DFS, Dijkstra, Bellman-Ford & MST", duration: "3 hrs", ytUrl: "https://youtu.be/bSZ57hAMkow", videoId: "bSZ57hAMkow" },
    ],
  },
  {
    id: "system-design",
    title: "System Design for High-Scalability (HLD & LLD)",
    instructor: "Gaurav Sen & ByteByteGo",
    category: "System Design & Architecture",
    level: "Intermediate to Senior",
    duration: "24 Hours • 60 Lessons",
    rating: 4.9,
    students: "89k enrolled",
    badge: "FAANG Essential",
    heroVideoId: "dGAgxozNWFE",
    thumbnail: "https://img.youtube.com/vi/dGAgxozNWFE/hqdefault.jpg",
    ytPlaylistId: "PLMC9HnGGQTQukrUj016mrWH98_a4mgtlE",
    desc: "Learn load balancing, consistent hashing, distributed caching with Redis, Kafka message queues, SQL vs NoSQL sharding, and real-world architectures (Uber, Netflix, WhatsApp).",
    modules: [
      { title: "Distributed Caching & Cache Invalidation Strategies", duration: "40 mins", ytUrl: "https://youtu.be/dGAgxozNWFE", videoId: "dGAgxozNWFE" },
      { title: "Consistent Hashing & Dynamic Load Balancers", duration: "35 mins", ytUrl: "https://youtu.be/zaRkONvyGr8", videoId: "zaRkONvyGr8" },
      { title: "Database Sharding, Replication & CAP Theorem", duration: "50 mins", ytUrl: "https://youtu.be/5faOjSkAmwE", videoId: "5faOjSkAmwE" },
      { title: "Design WhatsApp / Discord Real-Time Chat Engine", duration: "1 hr 10 mins", ytUrl: "https://youtu.be/vvhC64hQZMk", videoId: "vvhC64hQZMk" },
      { title: "Design Netflix Video Streaming Pipeline & CDN", duration: "1 hr 05 mins", ytUrl: "https://youtu.be/lYoSd2WCJTo", videoId: "lYoSd2WCJTo" },
    ],
  },
  {
    id: "fullstack-web",
    title: "Full-Stack Web Dev & Production Backend Bootcamp",
    instructor: "Harkirat Singh & 100xDevs",
    category: "Full-Stack Development",
    level: "All Levels",
    duration: "65 Hours • 210 Lessons",
    rating: 4.8,
    students: "115k enrolled",
    badge: "Comprehensive",
    heroVideoId: "30LWjhZzg50",
    thumbnail: "https://img.youtube.com/vi/30LWjhZzg50/hqdefault.jpg",
    ytPlaylistId: "PLinedj3B30sDby4Al-i13hQJG_oU1Ff13",
    desc: "Master Next.js 15, TypeScript, Node.js microservices, PostgreSQL with Prisma/Drizzle ORM, Docker containerization, WebSockets, and CI/CD pipelines.",
    modules: [
      { title: "TypeScript Generics & Advanced Type System", duration: "1 hr 20 mins", ytUrl: "https://youtu.be/30LWjhZzg50", videoId: "30LWjhZzg50" },
      { title: "Next.js App Router, Server Components & Actions", duration: "2 hrs", ytUrl: "https://youtu.be/wm5gMKuwSYk", videoId: "wm5gMKuwSYk" },
      { title: "PostgreSQL Queries, Indexing & Drizzle ORM Setup", duration: "1 hr 45 mins", ytUrl: "https://youtu.be/zw4SmPGL8Zs", videoId: "zw4SmPGL8Zs" },
      { title: "Docker Containers, Kubernetes & Production CI/CD", duration: "2 hrs 15 mins", ytUrl: "https://youtu.be/pg19Z8LL06w", videoId: "pg19Z8LL06w" },
      { title: "WebSockets & WebRTC for Real-Time Video/Audio", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/1BfCnjr_Vjg", videoId: "1BfCnjr_Vjg" },
    ],
  },
  {
    id: "core-cs",
    title: "Core CS Fundamentals for College Campus Placements",
    instructor: "Gate Smashers",
    category: "College Placements & Core CS",
    level: "College Students",
    duration: "32 Hours • 120 Lessons",
    rating: 4.9,
    students: "190k enrolled",
    badge: "Placement Track",
    heroVideoId: "bkSWJJZNgf8",
    thumbnail: "https://img.youtube.com/vi/bkSWJJZNgf8/hqdefault.jpg",
    ytPlaylistId: "PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdPvP",
    desc: "Acing college technical rounds: Operating Systems (Process Scheduling, Deadlocks, Virtual Memory), DBMS & Normalization, Computer Networks (TCP/IP, DNS), and OOPs.",
    modules: [
      { title: "Operating Systems: Process Management & CPU Scheduling", duration: "1 hr 10 mins", ytUrl: "https://youtu.be/bkSWJJZNgf8", videoId: "bkSWJJZNgf8" },
      { title: "Deadlocks & Memory Management (Paging, Segmentation)", duration: "1 hr 25 mins", ytUrl: "https://youtu.be/rNWx6sspg98", videoId: "rNWx6sspg98" },
      { title: "DBMS: 1NF, 2NF, 3NF, BCNF & SQL Transactions (ACID)", duration: "1 hr 40 mins", ytUrl: "https://youtu.be/5bFxbwf_1bY", videoId: "5bFxbwf_1bY" },
      { title: "Computer Networks: OSI Model, TCP vs UDP, Subnetting", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/IPvYjXCsTg8", videoId: "IPvYjXCsTg8" },
      { title: "Object-Oriented Programming (Polymorphism, Inheritance)", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/bSrm9RXwBaI", videoId: "bSrm9RXwBaI" },
    ],
  },
  {
    id: "company-playbooks",
    title: "Company-Wise Placement Playbooks & Interview Hacks",
    instructor: "PREP-AI Alumni & Industry Mentors",
    category: "Interview Strategy",
    level: "All Levels",
    duration: "18 Hours • 45 Lessons",
    rating: 4.8,
    students: "74k enrolled",
    badge: "Recruitment Special",
    heroVideoId: "1yT4h7P9Pq0",
    thumbnail: "https://img.youtube.com/vi/1yT4h7P9Pq0/hqdefault.jpg",
    ytPlaylistId: "PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
    desc: "Deep-dives into hiring processes of Google, Microsoft, Amazon (Leadership Principles), TCS Digital, Infosys SP, and modern Indian/Global unicorns.",
    modules: [
      { title: "Amazon Leadership Principles & Behavioral STAR Stories", duration: "50 mins", ytUrl: "https://youtu.be/1yT4h7P9Pq0", videoId: "1yT4h7P9Pq0" },
      { title: "Cracking Google Coding & System Rounds", duration: "1 hr", ytUrl: "https://youtu.be/4Uq7T4a6Xf8", videoId: "4Uq7T4a6Xf8" },
      { title: "TCS Digital / Infosys DSE Coding Test Patterns", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/2rZ4B1mQ0V8", videoId: "2rZ4B1mQ0V8" },
      { title: "Resume Building & Cold Emailing Engineering Managers", duration: "45 mins", ytUrl: "https://youtu.be/BYUy1yHL4Ww", videoId: "BYUy1yHL4Ww" },
    ],
  },
];

const CATEGORIES = [
  "All Tracks",
  "Data Structures & Algorithms",
  "System Design & Architecture",
  "Full-Stack Development",
  "College Placements & Core CS",
  "Interview Strategy",
];

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Tracks");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [completedModules, setCompletedModules] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("prep_ai_completed_modules") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  const openCourseModal = (course) => {
    setActiveCourse(course);
    setActiveVideoId(course.heroVideoId || course.modules[0]?.videoId);
  };

  const toggleModuleComplete = (courseId, moduleIdx) => {
    const key = `${courseId}_${moduleIdx}`;
    let updated;
    if (completedModules.includes(key)) {
      updated = completedModules.filter((k) => k !== key);
    } else {
      updated = [...completedModules, key];
      toast.success("Progress saved!");
    }
    setCompletedModules(updated);
    localStorage.setItem("prep_ai_completed_modules", JSON.stringify(updated));
  };

  const filteredCourses = COURSES.filter((c) => {
    const matchesCat = selectedCategory === "All Tracks" || c.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-cyan-500/10 to-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
              <GraduationCap className="w-4 h-4" />
              <span>COLLEGE PLACEMENT &amp; INTERVIEW ACADEMY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Curated Placement Courses &amp; Roadmaps
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Master DSA sheets, System Design, Full-Stack Architecture, and Core CS (OS, DBMS, CN) with top YouTube playlist references and lesson checklists.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 shrink-0">
            <div className="p-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold uppercase">Total Tracks</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">5 Curated</span>
            </div>
            <div className="p-2 border-l border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold uppercase">Completed</span>
              <span className="text-2xl font-black text-cyan-500 dark:text-cyan-400">
                {completedModules.length} Lessons
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, instructor, company..."
              className="pl-10 rounded-2xl glass-input text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs w-full sm:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md"
                    : "glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid with Visual YouTube Thumbnails */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const completedCount = course.modules.filter((_, idx) =>
            completedModules.includes(`${course.id}_${idx}`)
          ).length;
          const progressPercent = Math.round((completedCount / course.modules.length) * 100);

          return (
            <div
              key={course.id}
              className="glass-card rounded-3xl flex flex-col justify-between group border border-slate-200/80 dark:border-white/10 hover:border-cyan-400/40 relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
            >
              {/* Visual YouTube Thumbnail Banner with Overlay */}
              <div
                onClick={() => openCourseModal(course)}
                className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${course.heroVideoId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-cyan-400 border border-white/10">
                  {course.badge}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <Tv className="w-3.5 h-3.5 text-red-400" /> {course.instructor}
                  </span>
                  <span className="font-semibold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {course.modules.length} Lessons
                  </span>
                </div>
              </div>

              {/* Course Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400 font-normal">({course.students})</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => openCourseModal(course)}
                    className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors leading-snug cursor-pointer"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                    {course.desc}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10">
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold text-slate-400">
                      <span>Course Progress</span>
                      <span className="text-cyan-400 font-bold">{progressPercent}% ({completedCount}/{course.modules.length})</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-5 mt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>

                  <Button
                    onClick={() => openCourseModal(course)}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs px-5 shadow-md shadow-indigo-500/20 hover:scale-105 transition flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4" /> Start Lessons
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Modal with Embedded YouTube Player & Lesson Thumbnails Checklist */}
      <Dialog open={!!activeCourse} onOpenChange={(open) => !open && setActiveCourse(null)}>
        <DialogContent className="max-w-4xl w-[96vw] rounded-3xl p-0 overflow-hidden glass-panel border border-white/60 dark:border-white/10 shadow-2xl">
          {activeCourse && (
            <div className="flex flex-col max-h-[88vh]">
              {/* Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    <Tv className="w-4 h-4 text-red-500" /> Curated YouTube Placement Series
                  </div>
                  <DialogTitle className="text-xl sm:text-2xl font-black text-white">
                    {activeCourse.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-300 mt-0.5">
                    Curated references by {activeCourse.instructor} • {activeCourse.duration}
                  </DialogDescription>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
                {/* Embedded YouTube Player for Currently Active Lesson */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-terminal border border-white/10 shadow-xl bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideoId || activeCourse.heroVideoId}?autoplay=1&rel=0`}
                    title={activeCourse.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                {/* Lesson Checklist with Thumbnail Cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <BookMarked className="w-4 h-4 text-cyan-400" /> Syllabus &amp; Video Modules ({activeCourse.modules.length})
                    </h4>
                    <span className="text-xs text-slate-400">Click a lesson to stream or checkmark to complete</span>
                  </div>

                  <div className="space-y-3">
                    {activeCourse.modules.map((mod, idx) => {
                      const key = `${activeCourse.id}_${idx}`;
                      const isDone = completedModules.includes(key);
                      const isPlaying = (activeVideoId || activeCourse.heroVideoId) === mod.videoId;
                      const thumbUrl = `https://img.youtube.com/vi/${mod.videoId}/hqdefault.jpg`;

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl glass-card border transition-all flex items-center justify-between gap-3 ${
                            isPlaying
                              ? "border-cyan-400/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                              : isDone
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            {/* Checkbox button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleModuleComplete(activeCourse.id, idx);
                              }}
                              className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center transition-all ${
                                isDone
                                  ? "bg-emerald-500 text-slate-950 font-black"
                                  : "border border-slate-400 dark:border-white/20 hover:border-cyan-400"
                              }`}
                            >
                              {isDone && <Check className="w-4 h-4" />}
                            </button>

                            {/* Module Video Thumbnail Preview */}
                            <div
                              onClick={() => setActiveVideoId(mod.videoId)}
                              className="relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden bg-slate-800 shrink-0 cursor-pointer group"
                            >
                              <img
                                src={thumbUrl}
                                alt={mod.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                <Play className="w-4 h-4 text-white fill-current" />
                              </div>
                            </div>

                            {/* Module Title & Info */}
                            <div
                              onClick={() => setActiveVideoId(mod.videoId)}
                              className="cursor-pointer flex-1 min-w-0"
                            >
                              <span className={`text-xs font-bold block truncate ${
                                isPlaying ? "text-cyan-400" : isDone ? "line-through text-slate-400" : "text-slate-900 dark:text-white"
                              }`}>
                                {idx + 1}. {mod.title}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                                <span>Duration: {mod.duration}</span>
                                {isPlaying && (
                                  <span className="text-cyan-400 font-bold animate-pulse">• Now Playing</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setActiveVideoId(mod.videoId)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                                isPlaying
                                  ? "bg-cyan-500 text-slate-950"
                                  : "bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-400"
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span className="hidden sm:inline">{isPlaying ? "Playing" : "Play"}</span>
                            </button>

                            <a
                              href={mod.ytUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-cyan-500/10 transition"
                              title="Open on YouTube"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesPage;
