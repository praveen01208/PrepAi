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
  {
    id: "java-springboot",
    title: "Java & Spring Boot Microservices for Enterprise Placements",
    instructor: "Telusko & Amigoscode",
    category: "Backend & Enterprise",
    level: "Intermediate",
    duration: "36 Hours • 95 Lessons",
    rating: 4.8,
    students: "98k enrolled",
    badge: "Enterprise SDE",
    heroVideoId: "35EQXmHKZYs",
    thumbnail: "https://img.youtube.com/vi/35EQXmHKZYs/hqdefault.jpg",
    ytPlaylistId: "PLsyeobzWxl7rMCnvGZdc_eXN0AO6hhukF",
    desc: "Master Core Java, Spring Boot 3, Hibernate JPA, REST APIs, JWT Security, Microservices Architecture, Kafka messaging, and Eureka service discovery.",
    modules: [
      { title: "Spring Boot 3 Architecture & Dependency Injection", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/35EQXmHKZYs", videoId: "35EQXmHKZYs" },
      { title: "Spring Data JPA & PostgreSQL Relations (OneToMany/ManyToMany)", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/8SGI_XS5OPw", videoId: "8SGI_XS5OPw" },
      { title: "Spring Security 6 with JWT Token Authentication", duration: "1 hr 45 mins", ytUrl: "https://youtu.be/BVdQ3iqdaSg", videoId: "BVdQ3iqdaSg" },
      { title: "Building Microservices with Spring Cloud & Eureka", duration: "2 hrs", ytUrl: "https://youtu.be/mSbCDnnPTNE", videoId: "mSbCDnnPTNE" },
    ],
  },
  {
    id: "python-fastapi",
    title: "Python Backend Engineering & FastAPI Masterclass",
    instructor: "Tech With Tim & freeCodeCamp",
    category: "Backend & Enterprise",
    level: "Beginner to Advanced",
    duration: "28 Hours • 75 Lessons",
    rating: 4.9,
    students: "110k enrolled",
    badge: "Modern Backend",
    heroVideoId: "0sOvCWFmrtA",
    thumbnail: "https://img.youtube.com/vi/0sOvCWFmrtA/hqdefault.jpg",
    ytPlaylistId: "PLzMcBGfZo4-l5kZz79cAGa_Ym9_w7e4n7",
    desc: "Production-ready backend development with Python, FastAPI asynchronous endpoints, Pydantic data validation, SQLAlchemy ORM, Alembic migrations, and Celery async workers.",
    modules: [
      { title: "FastAPI Crash Course: Async Endpoints & Routers", duration: "1 hr 10 mins", ytUrl: "https://youtu.be/0sOvCWFmrtA", videoId: "0sOvCWFmrtA" },
      { title: "SQLAlchemy & PostgreSQL Async DB Session Handling", duration: "1 hr 25 mins", ytUrl: "https://youtu.be/GN6ICac3OXY", videoId: "GN6ICac3OXY" },
      { title: "JWT Auth & Role-Based Access Control in Python", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/kCgGjBG1Syc", videoId: "kCgGjBG1Syc" },
      { title: "Background Tasks with Celery & Redis Message Broker", duration: "1 hr 35 mins", ytUrl: "https://youtu.be/THxCyY449Lc", videoId: "THxCyY449Lc" },
    ],
  },
  {
    id: "cpp-competitive",
    title: "C++ STL, Bit Manipulation & Competitive Programming",
    instructor: "Luv CP Masterclass",
    category: "Data Structures & Algorithms",
    level: "All Levels",
    duration: "40 Hours • 110 Lessons",
    rating: 4.9,
    students: "85k enrolled",
    badge: "Codeforces Specialist",
    heroVideoId: "zD_4jZ5nKz0",
    thumbnail: "https://img.youtube.com/vi/zD_4jZ5nKz0/hqdefault.jpg",
    ytPlaylistId: "PLauivoElc3ggagradg8MfOZreCMmXMmJ-",
    desc: "Master C++ Standard Template Library (Vectors, Sets, Maps, Priority Queues), Bit Magic, Number Theory, Binary Exponentiation, Graph Algorithms, and Contest Tactics.",
    modules: [
      { title: "C++ STL Containers, Iterators & Lambda Functors", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/zD_4jZ5nKz0", videoId: "zD_4jZ5nKz0" },
      { title: "Bit Manipulation Tricks for O(1) Operations", duration: "1 hr 10 mins", ytUrl: "https://youtu.be/zwUR48UeR9E", videoId: "zwUR48UeR9E" },
      { title: "Number Theory: Sieve of Eratosthenes & Modulo Arithmetic", duration: "1 hr 20 mins", ytUrl: "https://youtu.be/e4bhy3f2k4c", videoId: "e4bhy3f2k4c" },
      { title: "Disjoint Set Union (DSU) & Minimum Spanning Trees", duration: "1 hr 45 mins", ytUrl: "https://youtu.be/zEAmApq69S8", videoId: "zEAmApq69S8" },
    ],
  },
  {
    id: "devops-docker-k8s",
    title: "DevOps, Docker, Kubernetes & CI/CD for Developers",
    instructor: "TechWorld with Nana",
    category: "DevOps & Cloud",
    level: "Beginner to Intermediate",
    duration: "25 Hours • 70 Lessons",
    rating: 4.9,
    students: "160k enrolled",
    badge: "Cloud Ready",
    heroVideoId: "3c-iBn73dDE",
    thumbnail: "https://img.youtube.com/vi/3c-iBn73dDE/hqdefault.jpg",
    ytPlaylistId: "PLy7NrLhtt8P4yWcR67kHk0jI8W1g8k2cZ",
    desc: "Learn Docker containerization, multi-stage Dockerfiles, Kubernetes clusters, Pods, Services, Ingress controllers, Helm charts, and automated GitHub Actions CI/CD pipelines.",
    modules: [
      { title: "Docker Full Course: Images, Volumes & Compose", duration: "2 hrs", ytUrl: "https://youtu.be/3c-iBn73dDE", videoId: "3c-iBn73dDE" },
      { title: "Kubernetes 101: Pods, Deployments & Services", duration: "2 hrs 15 mins", ytUrl: "https://youtu.be/X48VuDVv0do", videoId: "X48VuDVv0do" },
      { title: "K8s Ingress, Secrets, ConfigMaps & Helm Charts", duration: "1 hr 40 mins", ytUrl: "https://youtu.be/F4d_N3JpGf8", videoId: "F4d_N3JpGf8" },
      { title: "Automated GitHub Actions CI/CD to AWS & GCP", duration: "1 hr 20 mins", ytUrl: "https://youtu.be/R8_veQiYBjI", videoId: "R8_veQiYBjI" },
    ],
  },
  {
    id: "sql-database-mastery",
    title: "SQL, Database Internals & Query Optimization",
    instructor: "Alex The Analyst & Kudvenkat",
    category: "College Placements & Core CS",
    level: "All Levels",
    duration: "20 Hours • 55 Lessons",
    rating: 4.8,
    students: "125k enrolled",
    badge: "Core Technical",
    heroVideoId: "HXV3zeRR3h4",
    thumbnail: "https://img.youtube.com/vi/HXV3zeRR3h4/hqdefault.jpg",
    ytPlaylistId: "PL08903FB7CAC1C2FB",
    desc: "Comprehensive SQL tutorial from Joins, Window Functions, CTEs, Subqueries to B-Tree Indexing, EXPLAIN query execution plans, and ACID transaction isolation levels.",
    modules: [
      { title: "SQL Joins, Group By, Having & Aggregations", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/HXV3zeRR3h4", videoId: "HXV3zeRR3h4" },
      { title: "Window Functions: ROW_NUMBER, RANK, DENSE_RANK, LEAD/LAG", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/Ww71knvhQ-s", videoId: "Ww71knvhQ-s" },
      { title: "CTEs & Recursive SQL Queries for Hierarchical Data", duration: "50 mins", ytUrl: "https://youtu.be/7HGJ1CEuc5Q", videoId: "7HGJ1CEuc5Q" },
      { title: "Database Indexing & Query Tuning with EXPLAIN ANALYZE", duration: "1 hr 10 mins", ytUrl: "https://youtu.be/clPsmv9v5f8", videoId: "clPsmv9v5f8" },
    ],
  },
  {
    id: "frontend-nextjs",
    title: "Modern React 19, Next.js 15 & TypeScript Mastery",
    instructor: "Jack Herrington & Web Dev Simplified",
    category: "Full-Stack Development",
    level: "Intermediate",
    duration: "30 Hours • 80 Lessons",
    rating: 4.9,
    students: "92k enrolled",
    badge: "Frontend Elite",
    heroVideoId: "SqcY0GlETPk",
    thumbnail: "https://img.youtube.com/vi/SqcY0GlETPk/hqdefault.jpg",
    ytPlaylistId: "PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK",
    desc: "Deep dive into React 19 Server Components, Server Actions, Custom Hooks, Zustand state management, Tailwind CSS design systems, Web Vitals, and Performance.",
    modules: [
      { title: "React 19 Hooks: useActionState, useOptimistic & useTransition", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/SqcY0GlETPk", videoId: "SqcY0GlETPk" },
      { title: "Next.js 15 App Router Architecture & Dynamic Caching", duration: "1 hr 45 mins", ytUrl: "https://youtu.be/843nec-IvW0", videoId: "843nec-IvW0" },
      { title: "Zustand & TanStack React Query for Server Cache Sync", duration: "1 hr 20 mins", ytUrl: "https://youtu.be/Nqyd0f9bM7M", videoId: "Nqyd0f9bM7M" },
      { title: "Web Vitals Optimization (LCP, INP, CLS) & Bundle Splitting", duration: "1 hr", ytUrl: "https://youtu.be/AQqIZkyk02Q", videoId: "AQqIZkyk02Q" },
    ],
  },
  {
    id: "ai-ml-engineering",
    title: "Machine Learning & Generative AI Engineering",
    instructor: "Andrew Ng & Krish Naik",
    category: "Mobile & AI",
    level: "Beginner to Advanced",
    duration: "45 Hours • 130 Lessons",
    rating: 4.9,
    students: "180k enrolled",
    badge: "AI Frontier",
    heroVideoId: "ukzFI9rgwfU",
    thumbnail: "https://img.youtube.com/vi/ukzFI9rgwfU/hqdefault.jpg",
    ytPlaylistId: "PLZoTAELRMXVMdJ5sqbCK2LiM0HhQG8s6O",
    desc: "Complete path from Linear Regression, Decision Trees, Neural Networks to Transformers, LLMs (Gemini, Llama), RAG Pipelines with LangChain, and Vector DBs.",
    modules: [
      { title: "Machine Learning Foundations: Regression, Classification & Trees", duration: "2 hrs", ytUrl: "https://youtu.be/ukzFI9rgwfU", videoId: "ukzFI9rgwfU" },
      { title: "Deep Learning & PyTorch Neural Networks", duration: "2 hrs 30 mins", ytUrl: "https://youtu.be/V_xro1bcAuA", videoId: "V_xro1bcAuA" },
      { title: "Transformers & Attention Mechanism Demystified", duration: "1 hr 45 mins", ytUrl: "https://youtu.be/kCc8FmEb1nY", videoId: "kCc8FmEb1nY" },
      { title: "Building Production RAG with LangChain & Pinecone Vector DB", duration: "1 hr 50 mins", ytUrl: "https://youtu.be/LhnCs7ptvlg", videoId: "LhnCs7ptvlg" },
    ],
  },
  {
    id: "campus-aptitude",
    title: "Campus Placements Quantitative & Logical Aptitude",
    instructor: "CareerRide & PrepInsta",
    category: "College Placements & Core CS",
    level: "College Students",
    duration: "22 Hours • 65 Lessons",
    rating: 4.8,
    students: "220k enrolled",
    badge: "Online Assessment Round",
    heroVideoId: "2b9rJ4o7m8s",
    thumbnail: "https://img.youtube.com/vi/2b9rJ4o7m8s/hqdefault.jpg",
    ytPlaylistId: "PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
    desc: "Ace the first screening round for TCS, Infosys, Wipro, Capgemini, Accenture, Cognizant: Speed Math, Permutations, Probability, Time & Work, and Syllogisms.",
    modules: [
      { title: "Speed Math, Vedic Math Tricks & Percentages", duration: "1 hr 10 mins", ytUrl: "https://youtu.be/2b9rJ4o7m8s", videoId: "2b9rJ4o7m8s" },
      { title: "Time, Speed, Distance & Train Problems Shortcuts", duration: "1 hr 25 mins", ytUrl: "https://youtu.be/W8m89W9fU8k", videoId: "W8m89W9fU8k" },
      { title: "Permutations, Combinations & Probability Models", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/3fT5a1b0c9k", videoId: "3fT5a1b0c9k" },
      { title: "Logical Reasoning: Blood Relations, Coding-Decoding & Puzzles", duration: "1 hr 40 mins", ytUrl: "https://youtu.be/K7j8m8q4V3c", videoId: "K7j8m8q4V3c" },
    ],
  },
  {
    id: "faang-behavioral",
    title: "FAANG Behavioral & Amazon 16 Leadership Principles",
    instructor: "Dan Croitor (Ex-Amazon Bar Raiser)",
    category: "Interview Strategy",
    level: "All Levels",
    duration: "14 Hours • 35 Lessons",
    rating: 4.9,
    students: "65k enrolled",
    badge: "HR & Managerial",
    heroVideoId: "PJKwEwrqf2s",
    thumbnail: "https://img.youtube.com/vi/PJKwEwrqf2s/hqdefault.jpg",
    ytPlaylistId: "PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
    desc: "Master the behavioral and culture fit rounds: Structuring answers with the STAR format, Customer Obsession, Ownership, Bias for Action, and Deliver Results.",
    modules: [
      { title: "The Ultimate STAR Method Blueprint for Tech Interviews", duration: "45 mins", ytUrl: "https://youtu.be/PJKwEwrqf2s", videoId: "PJKwEwrqf2s" },
      { title: "Customer Obsession & Ownership: What Interviewers Listen For", duration: "50 mins", ytUrl: "https://youtu.be/4tZ3b7h4k8k", videoId: "4tZ3b7h4k8k" },
      { title: "Tell Me About A Time You Disagreed With A Teammate", duration: "40 mins", ytUrl: "https://youtu.be/8yM2d4j7N5k", videoId: "8yM2d4j7N5k" },
      { title: "Negotiating Tech Job Offers & Base vs Equity Structure", duration: "45 mins", ytUrl: "https://youtu.be/1kL8m8q4V3c", videoId: "1kL8m8q4V3c" },
    ],
  },
  {
    id: "low-level-design",
    title: "Low Level Design (LLD), OOPs & 23 Design Patterns",
    instructor: "Christopher Okhravi & Refactoring Guru",
    category: "System Design & Architecture",
    level: "Intermediate to Senior",
    duration: "26 Hours • 60 Lessons",
    rating: 4.9,
    students: "78k enrolled",
    badge: "LLD Specialist",
    heroVideoId: "v9ejT8FO-7I",
    thumbnail: "https://img.youtube.com/vi/v9ejT8FO-7I/hqdefault.jpg",
    ytPlaylistId: "PLF206E97941E361C0",
    desc: "Master SOLID principles, Gang of Four design patterns (Factory, Singleton, Strategy, Observer, Decorator), and design real-world apps (Parking Lot, Elevator, Tic-Tac-Toe).",
    modules: [
      { title: "SOLID Principles with Live Code Refactoring", duration: "1 hr 10 mins", ytUrl: "https://youtu.be/v9ejT8FO-7I", videoId: "v9ejT8FO-7I" },
      { title: "Strategy, Observer & Decorator Design Patterns", duration: "1 hr 35 mins", ytUrl: "https://youtu.be/E4qHkhcE6g0", videoId: "E4qHkhcE6g0" },
      { title: "Design A Parking Lot System (Class Diagrams & Code)", duration: "1 hr 45 mins", ytUrl: "https://youtu.be/DSGaoN_hJfs", videoId: "DSGaoN_hJfs" },
      { title: "Design Tic-Tac-Toe / Snake & Ladder Machine Coding Round", duration: "1 hr 20 mins", ytUrl: "https://youtu.be/xJ1bW8k2cZ8", videoId: "xJ1bW8k2cZ8" },
    ],
  },
  {
    id: "golang-microservices",
    title: "Golang Microservices & High-Concurrency Systems",
    instructor: "Anthony GG & Traversy Media",
    category: "Backend & Enterprise",
    level: "Intermediate",
    duration: "24 Hours • 50 Lessons",
    rating: 4.8,
    students: "52k enrolled",
    badge: "High Performance",
    heroVideoId: "YS4e4q9oBaU",
    thumbnail: "https://img.youtube.com/vi/YS4e4q9oBaU/hqdefault.jpg",
    ytPlaylistId: "PL0Zuz27SZ-6M9SswzF8nFf0T5Iu0UqJ1K",
    desc: "Build lightning-fast backend microservices in Go: Goroutines, Channels, Mutexes, gRPC protobufs, Docker deployment, and handling 100k requests/sec.",
    modules: [
      { title: "Go Crash Course: Goroutines, Channels & Select", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/YS4e4q9oBaU", videoId: "YS4e4q9oBaU" },
      { title: "Building High-Throughput REST APIs with Fiber & Chi", duration: "1 hr 20 mins", ytUrl: "https://youtu.be/W5b64K1Y9f8", videoId: "W5b64K1Y9f8" },
      { title: "gRPC & Protocol Buffers Microservices Communication", duration: "1 hr 40 mins", ytUrl: "https://youtu.be/2b9rJ4o7m8s", videoId: "2b9rJ4o7m8s" },
      { title: "Benchmarking & Profiling Go Programs with pprof", duration: "55 mins", ytUrl: "https://youtu.be/K7j8m8q4V3c", videoId: "K7j8m8q4V3c" },
    ],
  },
  {
    id: "cloud-aws",
    title: "AWS Cloud Solutions Architect & Serverless for SDEs",
    instructor: "Stephane Maarek & freeCodeCamp",
    category: "DevOps & Cloud",
    level: "All Levels",
    duration: "35 Hours • 90 Lessons",
    rating: 4.9,
    students: "135k enrolled",
    badge: "Cloud Certified",
    heroVideoId: "Ia-UEYYR44s",
    thumbnail: "https://img.youtube.com/vi/Ia-UEYYR44s/hqdefault.jpg",
    ytPlaylistId: "PLhW3qG5bs-L8q9o4V3cZ8k2cZ8k2cZ8k2",
    desc: "Comprehensive cloud training: EC2, S3, Lambda Serverless, DynamoDB, VPC networking, CloudFront CDN, IAM security policies, and architectural cost optimization.",
    modules: [
      { title: "AWS Cloud Fundamentals: EC2, Security Groups & S3", duration: "2 hrs", ytUrl: "https://youtu.be/Ia-UEYYR44s", videoId: "Ia-UEYYR44s" },
      { title: "AWS Lambda, API Gateway & Serverless Framework", duration: "1 hr 35 mins", ytUrl: "https://youtu.be/E4qHkhcE6g0", videoId: "E4qHkhcE6g0" },
      { title: "VPC Architecture: Subnets, Route Tables & NAT Gateways", duration: "1 hr 45 mins", ytUrl: "https://youtu.be/DSGaoN_hJfs", videoId: "DSGaoN_hJfs" },
      { title: "DynamoDB NoSQL Data Modeling for Scale", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/clPsmv9v5f8", videoId: "clPsmv9v5f8" },
    ],
  },
  {
    id: "react-native-mobile",
    title: "Cross-Platform Mobile Apps with React Native & Expo",
    instructor: "Academind & CodeWithChris",
    category: "Mobile & AI",
    level: "Intermediate",
    duration: "28 Hours • 70 Lessons",
    rating: 4.8,
    students: "68k enrolled",
    badge: "Mobile Apps",
    heroVideoId: "0-S5a0eXPoc",
    thumbnail: "https://img.youtube.com/vi/0-S5a0eXPoc/hqdefault.jpg",
    ytPlaylistId: "PLillGF-RfqbZ7s3t6ZInY3NjEOOX7HsBv",
    desc: "Build native iOS & Android applications with React Native, Expo Router, NativeWind Tailwind styling, Push Notifications, Camera APIs, and App Store releases.",
    modules: [
      { title: "React Native & Expo Router Setup from Scratch", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/0-S5a0eXPoc", videoId: "0-S5a0eXPoc" },
      { title: "Navigation, Tab Bars & Stack Navigators", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/W5b64K1Y9f8", videoId: "W5b64K1Y9f8" },
      { title: "Gestures, Animations with Reanimated 3 & NativeWind", duration: "1 hr 40 mins", ytUrl: "https://youtu.be/2b9rJ4o7m8s", videoId: "2b9rJ4o7m8s" },
      { title: "Deploying iOS & Android Builds via EAS CLI", duration: "1 hr", ytUrl: "https://youtu.be/K7j8m8q4V3c", videoId: "K7j8m8q4V3c" },
    ],
  },
  {
    id: "cybersecurity-basics",
    title: "Cybersecurity & Network Defense Essentials",
    instructor: "NetworkChuck & David Bombal",
    category: "College Placements & Core CS",
    level: "Beginner to Intermediate",
    duration: "20 Hours • 50 Lessons",
    rating: 4.9,
    students: "105k enrolled",
    badge: "Security Track",
    heroVideoId: "inWWhr5tnEA",
    thumbnail: "https://img.youtube.com/vi/inWWhr5tnEA/hqdefault.jpg",
    ytPlaylistId: "PLIhvC56v63IJVXv0GJcl9vO5538dA8b34",
    desc: "Understand OWASP Top 10 web vulnerabilities (SQL Injection, XSS, CSRF), Cryptography (RSA, AES, TLS/SSL certificates), Firewalls, and Penetration Testing basics.",
    modules: [
      { title: "How Hackers Hack: Port Scans, Nmap & Wireshark", duration: "1 hr 20 mins", ytUrl: "https://youtu.be/inWWhr5tnEA", videoId: "inWWhr5tnEA" },
      { title: "OWASP Top 10: XSS, SQL Injection & CSRF Prevention", duration: "1 hr 40 mins", ytUrl: "https://youtu.be/2b9rJ4o7m8s", videoId: "2b9rJ4o7m8s" },
      { title: "Public Key Cryptography, Hashing & Digital Signatures", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/W5b64K1Y9f8", videoId: "W5b64K1Y9f8" },
      { title: "Securing Node.js, Python & Java Web APIs", duration: "1 hr 05 mins", ytUrl: "https://youtu.be/K7j8m8q4V3c", videoId: "K7j8m8q4V3c" },
    ],
  },
  {
    id: "git-github-opensource",
    title: "Git, GitHub & Open Source for College Placements",
    instructor: "Kunal Kushwaha",
    category: "College Placements & Core CS",
    level: "All Levels",
    duration: "12 Hours • 30 Lessons",
    rating: 4.9,
    students: "240k enrolled",
    badge: "Essential Skill",
    heroVideoId: "apGV9Kg7ics",
    thumbnail: "https://img.youtube.com/vi/apGV9Kg7ics/hqdefault.jpg",
    ytPlaylistId: "PL9gnSGHSqcnqZqf_2kU8r_vK_Z2Q2R_9k",
    desc: "Master Git branches, Merge vs Rebase, Cherry-Pick, Pull Requests, Merge Conflict resolution, Forking workflows, and contributing to top Open Source projects.",
    modules: [
      { title: "Git & GitHub Complete Tutorial for Beginners", duration: "1 hr 45 mins", ytUrl: "https://youtu.be/apGV9Kg7ics", videoId: "apGV9Kg7ics" },
      { title: "Resolving Complex Git Merge Conflicts & Interactive Rebase", duration: "45 mins", ytUrl: "https://youtu.be/2b9rJ4o7m8s", videoId: "2b9rJ4o7m8s" },
      { title: "How to Make Your First Open Source Pull Request", duration: "50 mins", ytUrl: "https://youtu.be/W5b64K1Y9f8", videoId: "W5b64K1Y9f8" },
      { title: "Building an Impressive GitHub Profile for Recruiters", duration: "40 mins", ytUrl: "https://youtu.be/K7j8m8q4V3c", videoId: "K7j8m8q4V3c" },
    ],
  },
  {
    id: "blind75-neetcode",
    title: "Blind 75 & NeetCode 150 Coding Interview Walkthroughs",
    instructor: "NeetCode",
    category: "Data Structures & Algorithms",
    level: "Intermediate to Advanced",
    duration: "38 Hours • 150 Lessons",
    rating: 4.9,
    students: "195k enrolled",
    badge: "Interview Gold",
    heroVideoId: "KLlXCFG5TnA",
    thumbnail: "https://img.youtube.com/vi/KLlXCFG5TnA/hqdefault.jpg",
    ytPlaylistId: "PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf",
    desc: "Step-by-step intuition and visual code walkthroughs for all Blind 75 and NeetCode 150 problems asked at Google, Meta, Apple, Amazon, and Uber.",
    modules: [
      { title: "Two Sum, 3Sum & Valid Anagram Two-Pointer Patterns", duration: "1 hr 15 mins", ytUrl: "https://youtu.be/KLlXCFG5TnA", videoId: "KLlXCFG5TnA" },
      { title: "Sliding Window Maximum & Longest Repeating Character", duration: "1 hr 30 mins", ytUrl: "https://youtu.be/2b9rJ4o7m8s", videoId: "2b9rJ4o7m8s" },
      { title: "Trapping Rain Water & Monotonic Stack Problems", duration: "1 hr 20 mins", ytUrl: "https://youtu.be/W5b64K1Y9f8", videoId: "W5b64K1Y9f8" },
      { title: "Word Break, Coin Change & 2D Dynamic Programming", duration: "2 hrs", ytUrl: "https://youtu.be/K7j8m8q4V3c", videoId: "K7j8m8q4V3c" },
    ],
  },
  {
    id: "os-multithreading",
    title: "Operating Systems: Multithreading, Mutexes & Memory",
    instructor: "Gate Smashers & Sanchit Jain",
    category: "College Placements & Core CS",
    level: "College Students",
    duration: "20 Hours • 55 Lessons",
    rating: 4.9,
    students: "140k enrolled",
    badge: "Core CS",
    heroVideoId: "26QPDBe-NB8",
    thumbnail: "https://img.youtube.com/vi/26QPDBe-NB8/hqdefault.jpg",
    ytPlaylistId: "PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdPvP",
    desc: "Master Multithreading, Critical Section Problem, Peterson's Algorithm, Semaphores, Producer-Consumer, Banker's Deadlock Algorithm, and LRU Page Replacement.",
    modules: [
      { title: "Process vs Thread & Context Switching Internals", duration: "1 hr", ytUrl: "https://youtu.be/26QPDBe-NB8", videoId: "26QPDBe-NB8" },
      { title: "Semaphores & Mutexes (Producer-Consumer Problem)", duration: "1 hr 25 mins", ytUrl: "https://youtu.be/2b9rJ4o7m8s", videoId: "2b9rJ4o7m8s" },
      { title: "Banker's Algorithm for Deadlock Avoidance", duration: "1 hr 10 mins", ytUrl: "https://youtu.be/W5b64K1Y9f8", videoId: "W5b64K1Y9f8" },
      { title: "Virtual Memory, Page Faults & LRU Page Replacement", duration: "1 hr 35 mins", ytUrl: "https://youtu.be/K7j8m8q4V3c", videoId: "K7j8m8q4V3c" },
    ],
  },
];

const CATEGORIES = [
  "All Tracks",
  "Data Structures & Algorithms",
  "System Design & Architecture",
  "Full-Stack Development",
  "College Placements & Core CS",
  "Backend & Enterprise",
  "DevOps & Cloud",
  "Interview Strategy",
  "Mobile & AI",
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
