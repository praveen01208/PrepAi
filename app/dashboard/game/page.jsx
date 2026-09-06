"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Zap,
  Bug,
  Keyboard,
  Brain,
  Trophy,
  Flame,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  Check,
  Star,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";

// ==========================================
// GAME DATA & CONFIGURATIONS
// ==========================================

// 1. Trivia Questions
const TRIVIA_QUESTIONS = [
  {
    question: "What is the time complexity of searching in a balanced Binary Search Tree?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correct: 2,
    explanation: "In a balanced BST, each step divides the search space in half, resulting in O(log n) time complexity.",
  },
  {
    question: "Which hook in React is used to perform side effects in functional components?",
    options: ["useContext", "useEffect", "useMemo", "useReducer"],
    correct: 1,
    explanation: "useEffect is specifically designed for handling side effects like data fetching, subscriptions, or DOM mutations.",
  },
  {
    question: "In JavaScript, what will `typeof null` evaluate to?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correct: 2,
    explanation: "typeof null returns 'object'. This is a historical bug in JavaScript that remains for backward compatibility.",
  },
  {
    question: "What does the CAP theorem state for distributed databases?",
    options: [
      "Can choose all 3: Consistency, Availability, Partition tolerance",
      "Can choose at most 2 out of 3: Consistency, Availability, Partition tolerance",
      "Calculates Algorithm Performance",
      "Concurrency and Parallelism protocol",
    ],
    correct: 1,
    explanation: "The CAP theorem proves a distributed system can only provide 2 of 3 guarantees simultaneously.",
  },
  {
    question: "Which HTTP status code represents '401 Unauthorized'?",
    options: ["403", "401", "404", "500"],
    correct: 1,
    explanation: "401 indicates that authentication is required and has failed or has not yet been provided.",
  },
];

// 2. Bug Smasher Challenges
const BUG_CHALLENGES = [
  {
    id: 1,
    title: "Infinite React Loop",
    snippet: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
  }); // Line 6

  return <div>{user?.name}</div>;
}`,
    bugLine: 6,
    fixOptions: [
      "Add [userId] as dependency array in useEffect",
      "Change useState(null) to useState('')",
      "Remove fetchUser call",
      "Use useMemo instead of useEffect",
    ],
    correctFix: 0,
    explanation: "Missing dependency array causes useEffect to re-run after every render, creating an infinite loop when setUser updates state.",
  },
  {
    id: 2,
    title: "Off-by-One Array Error",
    snippet: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i <= arr.length; i++) { // Line 3
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
    bugLine: 3,
    fixOptions: [
      "Change i <= arr.length to i < arr.length",
      "Change i = 1 to i = 0",
      "Change arr[i] > max to arr[i] < max",
      "Change let max = arr[0] to let max = 0",
    ],
    correctFix: 0,
    explanation: "Loop condition `i <= arr.length` accesses `arr[arr.length]` which is undefined and causes out-of-bounds comparison.",
  },
  {
    id: 3,
    title: "Closure Stale State in setInterval",
    snippet: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Line 6
    }, 1000);
    return () => clearInterval(id);
  }, []);
}`,
    bugLine: 6,
    fixOptions: [
      "Use functional update `setCount(prev => prev + 1)`",
      "Remove return () => clearInterval(id)",
      "Change interval delay to 0",
      "Use count++ instead of setCount",
    ],
    correctFix: 0,
    explanation: "The effect closure captures initial `count` (0), causing `setCount(0 + 1)` every second. Functional state update fixes the stale closure.",
  },
];

// 3. Syntax Racer Snippets
const RACER_SNIPPETS = [
  {
    id: 1,
    name: "Binary Search",
    lang: "javascript",
    code: "let mid = Math.floor((low + high) / 2);",
  },
  {
    id: 2,
    name: "React Custom Hook",
    lang: "javascript",
    code: "const [data, setData] = useState(initialValue);",
  },
  {
    id: 3,
    name: "Async Fetch",
    lang: "javascript",
    code: "const res = await fetch(url); const json = await res.json();",
  },
];

// 4. Memory Match Pair Cards
const MEMORY_CARDS_RAW = [
  { id: 1, text: "Hash Table Search", matchId: "hash" },
  { id: 2, text: "O(1) Average", matchId: "hash" },
  { id: 3, text: "Binary Search", matchId: "binsearch" },
  { id: 4, text: "O(log n)", matchId: "binsearch" },
  { id: 5, text: "Merge Sort", matchId: "mergesort" },
  { id: 6, text: "O(n log n)", matchId: "mergesort" },
  { id: 7, text: "Linear Search", matchId: "linsearch" },
  { id: 8, text: "O(n)", matchId: "linsearch" },
];

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState("trivia"); // 'trivia' | 'bugs' | 'racer' | 'memory'
  const [totalXP, setTotalXP] = useState(1450);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --- TRIVIA STATE ---
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaSelected, setTriviaSelected] = useState(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaStreak, setTriviaStreak] = useState(0);
  const [triviaGameOver, setTriviaGameOver] = useState(false);
  const [triviaTimer, setTriviaTimer] = useState(15);

  // --- BUG SMASHER STATE ---
  const [bugIndex, setBugIndex] = useState(0);
  const [bugSelectedFix, setBugSelectedFix] = useState(null);
  const [bugScore, setBugScore] = useState(0);
  const [bugGameOver, setBugGameOver] = useState(false);

  // --- RACER STATE ---
  const [racerIndex, setRacerIndex] = useState(0);
  const [racerInput, setRacerInput] = useState("");
  const [racerStartTime, setRacerStartTime] = useState(null);
  const [racerWpm, setRacerWpm] = useState(0);
  const [racerFinished, setRacerFinished] = useState(false);

  // --- MEMORY MATCH STATE ---
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryGameOver, setMemoryGameOver] = useState(false);

  // Initialize Memory Game
  useEffect(() => {
    resetMemoryGame();
  }, []);

  // Trivia Timer countdown
  useEffect(() => {
    if (activeTab !== "trivia" || triviaGameOver || triviaSelected !== null) return;

    const timer = setInterval(() => {
      setTriviaTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTriviaOption(null); // Time out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, triviaIndex, triviaSelected, triviaGameOver]);

  const resetMemoryGame = () => {
    const shuffled = [...MEMORY_CARDS_RAW]
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({ ...item, uniqueId: idx }));
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
    setMemoryGameOver(false);
  };

  // Trivia Option Handler
  const handleTriviaOption = (optIdx) => {
    if (triviaSelected !== null) return;
    setTriviaSelected(optIdx);

    const currentQ = TRIVIA_QUESTIONS[triviaIndex];
    if (optIdx === currentQ.correct) {
      setTriviaScore((prev) => prev + 100 + triviaStreak * 20);
      setTriviaStreak((prev) => prev + 1);
      setTotalXP((prev) => prev + 50);
    } else {
      setTriviaStreak(0);
    }
  };

  const nextTriviaQuestion = () => {
    if (triviaIndex < TRIVIA_QUESTIONS.length - 1) {
      setTriviaIndex((prev) => prev + 1);
      setTriviaSelected(null);
      setTriviaTimer(15);
    } else {
      setTriviaGameOver(true);
    }
  };

  const resetTrivia = () => {
    setTriviaIndex(0);
    setTriviaSelected(null);
    setTriviaScore(0);
    setTriviaStreak(0);
    setTriviaGameOver(false);
    setTriviaTimer(15);
  };

  // Bug Smasher Handler
  const handleBugFixSelect = (idx) => {
    if (bugSelectedFix !== null) return;
    setBugSelectedFix(idx);

    if (idx === BUG_CHALLENGES[bugIndex].correctFix) {
      setBugScore((prev) => prev + 150);
      setTotalXP((prev) => prev + 75);
    }
  };

  const nextBugChallenge = () => {
    if (bugIndex < BUG_CHALLENGES.length - 1) {
      setBugIndex((prev) => prev + 1);
      setBugSelectedFix(null);
    } else {
      setBugGameOver(true);
    }
  };

  const resetBugSmasher = () => {
    setBugIndex(0);
    setBugSelectedFix(null);
    setBugScore(0);
    setBugGameOver(false);
  };

  // Racer Input Handler
  const handleRacerChange = (e) => {
    const val = e.target.value;
    if (!racerStartTime) setRacerStartTime(Date.now());

    setRacerInput(val);
    const targetCode = RACER_SNIPPETS[racerIndex].code;

    if (val === targetCode) {
      const timeInSec = (Date.now() - racerStartTime) / 1000;
      const wpm = Math.round((targetCode.length / 5) / (timeInSec / 60)) || 60;
      setRacerWpm(wpm);
      setRacerFinished(true);
      setTotalXP((prev) => prev + 100);
    }
  };

  const nextRacerSnippet = () => {
    if (racerIndex < RACER_SNIPPETS.length - 1) {
      setRacerIndex((prev) => prev + 1);
      setRacerInput("");
      setRacerStartTime(null);
      setRacerFinished(false);
    } else {
      setRacerFinished(true);
    }
  };

  const resetRacer = () => {
    setRacerIndex(0);
    setRacerInput("");
    setRacerStartTime(null);
    setRacerWpm(0);
    setRacerFinished(false);
  };

  // Memory Card Click Handler
  const handleCardClick = (card) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.some((c) => c.uniqueId === card.uniqueId) ||
      matchedCards.includes(card.uniqueId)
    )
      return;

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((prev) => prev + 1);
      if (newFlipped[0].matchId === newFlipped[1].matchId) {
        setMatchedCards((prev) => [...prev, newFlipped[0].uniqueId, newFlipped[1].uniqueId]);
        setFlippedCards([]);
        setTotalXP((prev) => prev + 40);

        if (matchedCards.length + 2 === cards.length) {
          setMemoryGameOver(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 py-8 px-4 sm:px-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan-500/20 top-0 -left-40 rounded-full blur-[140px] pointer-events-none" />
      <div className="ambient-glow w-[600px] h-[600px] bg-purple-600/20 bottom-10 right-0 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl backdrop-blur-2xl bg-slate-900/60 border border-white/10 shadow-2xl shadow-cyan-950/20">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/30 text-white">
                <Gamepad2 className="w-6 h-6 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Developer Arcade & Games Arena
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm pl-12">
              Master CS fundamentals, smash coding bugs, and boost your typing speed in interactive mini-games.
            </p>
          </div>

          {/* Stats Widget */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total XP</div>
                <div className="text-sm font-extrabold text-amber-300">{totalXP} XP</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Streak</div>
                <div className="text-sm font-extrabold text-rose-400">5 Days</div>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-slate-300"
              title="Toggle Audio Effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Game Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "trivia", title: "Trivia Blitz", icon: Zap, color: "from-cyan-500 to-blue-600" },
            { id: "bugs", title: "Bug Smasher", icon: Bug, color: "from-purple-500 to-pink-600" },
            { id: "racer", title: "Syntax Racer", icon: Keyboard, color: "from-emerald-500 to-teal-600" },
            { id: "memory", title: "Memory Matrix", icon: Brain, color: "from-amber-500 to-orange-600" },
          ].map((game) => {
            const Icon = game.icon;
            const isActive = activeTab === game.id;
            return (
              <button
                key={game.id}
                onClick={() => setActiveTab(game.id)}
                className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 backdrop-blur-xl border ${
                  isActive
                    ? `bg-gradient-to-r ${game.color} text-white border-white/20 shadow-lg shadow-cyan-500/20 scale-[1.02]`
                    : "bg-slate-900/50 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{game.title}</span>
              </button>
            );
          })}
        </div>

        {/* GAME CONTENT CONTAINER */}
        <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-slate-900/60 border border-white/10 shadow-2xl min-h-[420px]">
          {/* ======================================================== */}
          {/* 1. TRIVIA BLITZ GAME */}
          {/* ======================================================== */}
          {activeTab === "trivia" && (
            <div className="space-y-6">
              {!triviaGameOver ? (
                <>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-bold text-slate-400">
                      <span>Question {triviaIndex + 1} of {TRIVIA_QUESTIONS.length}</span>
                      {triviaStreak > 1 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-extrabold flex items-center gap-1 animate-pulse">
                          <Flame className="w-3 h-3 text-amber-400" /> {triviaStreak}x Streak!
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-400">
                        <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span>{triviaTimer}s</span>
                      </div>
                      <div className="font-extrabold text-amber-400 text-base">{triviaScore} pts</div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                      {TRIVIA_QUESTIONS[triviaIndex].question}
                    </h2>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {TRIVIA_QUESTIONS[triviaIndex].options.map((option, idx) => {
                        const isSelected = triviaSelected === idx;
                        const isCorrect = idx === TRIVIA_QUESTIONS[triviaIndex].correct;
                        let btnStyle = "bg-slate-950/60 border-white/10 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-800/80";

                        if (triviaSelected !== null) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold";
                          } else {
                            btnStyle = "bg-slate-950/30 border-white/5 text-slate-500 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleTriviaOption(idx)}
                            disabled={triviaSelected !== null}
                            className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {triviaSelected !== null && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                            {triviaSelected !== null && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation & Next */}
                  {triviaSelected !== null && (
                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs sm:text-sm text-cyan-200 space-y-2 animate-in fade-in duration-300">
                      <div className="font-bold flex items-center gap-1.5 text-cyan-300">
                        <Sparkles className="w-4 h-4 text-cyan-400" /> Explanation
                      </div>
                      <p className="text-slate-300">{TRIVIA_QUESTIONS[triviaIndex].explanation}</p>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={nextTriviaQuestion}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold hover:opacity-90 transition flex items-center gap-1.5"
                        >
                          Next Question <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Game Over Screen */
                <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                    <Trophy className="w-8 h-8 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Trivia Blitz Complete!</h2>
                  <p className="text-slate-400 text-sm">
                    You scored <span className="font-extrabold text-amber-300">{triviaScore} Points</span> and earned <span className="font-extrabold text-cyan-400">+250 XP</span>!
                  </p>
                  <button
                    onClick={resetTrivia}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold hover:scale-105 transition flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. BUG SMASHER GAME */}
          {/* ======================================================== */}
          {activeTab === "bugs" && (
            <div className="space-y-6">
              {!bugGameOver ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs sm:text-sm">
                    <div className="font-bold text-slate-400">
                      Bug #{bugIndex + 1}: <span className="text-purple-300">{BUG_CHALLENGES[bugIndex].title}</span>
                    </div>
                    <div className="font-extrabold text-amber-400 text-base">{bugScore} pts</div>
                  </div>

                  {/* Code Snippet */}
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                    <div className="px-4 py-2 bg-slate-900 border-b border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>snippet.js</span>
                      <span className="text-rose-400 flex items-center gap-1 font-sans">
                        <ShieldAlert className="w-3.5 h-3.5" /> Bug on Line {BUG_CHALLENGES[bugIndex].bugLine}
                      </span>
                    </div>
                    <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                      {BUG_CHALLENGES[bugIndex].snippet}
                    </pre>
                  </div>

                  {/* Fix Options */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Select the correct bug fix:
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {BUG_CHALLENGES[bugIndex].fixOptions.map((opt, idx) => {
                        const isSelected = bugSelectedFix === idx;
                        const isCorrect = idx === BUG_CHALLENGES[bugIndex].correctFix;
                        let btnStyle = "bg-slate-950/60 border-white/10 text-slate-300 hover:border-purple-500/40";

                        if (bugSelectedFix !== null) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold";
                          } else {
                            btnStyle = "bg-slate-950/30 border-white/5 text-slate-500 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleBugFixSelect(idx)}
                            disabled={bugSelectedFix !== null}
                            className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {bugSelectedFix !== null && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {bugSelectedFix !== null && (
                    <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs sm:text-sm text-purple-200 space-y-2">
                      <div className="font-bold flex items-center gap-1.5 text-purple-300">
                        <Bug className="w-4 h-4 text-purple-400" /> Diagnosis & Fix
                      </div>
                      <p className="text-slate-300">{BUG_CHALLENGES[bugIndex].explanation}</p>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={nextBugChallenge}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold hover:opacity-90 transition flex items-center gap-1.5"
                        >
                          Next Bug <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-xl">
                    <Bug className="w-8 h-8 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Bug Hunter Master!</h2>
                  <p className="text-slate-400 text-sm">
                    You fixed all bugs and scored <span className="font-extrabold text-purple-300">{bugScore} Points</span>!
                  </p>
                  <button
                    onClick={resetBugSmasher}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold hover:scale-105 transition flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. SYNTAX RACER GAME */}
          {/* ======================================================== */}
          {activeTab === "racer" && (
            <div className="space-y-6">
              {!racerFinished ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs sm:text-sm">
                    <div className="font-bold text-slate-400">
                      Target Code Snippet ({racerIndex + 1}/{RACER_SNIPPETS.length}):{" "}
                      <span className="text-emerald-400 font-mono">{RACER_SNIPPETS[racerIndex].name}</span>
                    </div>
                    {racerWpm > 0 && <div className="font-extrabold text-emerald-400">{racerWpm} WPM</div>}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs sm:text-base text-slate-400 leading-relaxed select-none">
                    {RACER_SNIPPETS[racerIndex].code.split("").map((char, idx) => {
                      let charStyle = "text-slate-500";
                      if (idx < racerInput.length) {
                        charStyle = racerInput[idx] === char ? "text-emerald-400 bg-emerald-500/10 font-bold" : "text-rose-400 bg-rose-500/20 underline";
                      }
                      return (
                        <span key={idx} className={charStyle}>
                          {char}
                        </span>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Type the exact code snippet as fast as you can:
                    </label>
                    <textarea
                      value={racerInput}
                      onChange={handleRacerChange}
                      rows={2}
                      placeholder="Start typing here to trigger timer..."
                      className="w-full p-4 rounded-2xl bg-slate-950/80 border border-white/15 text-emerald-300 font-mono text-xs sm:text-base focus:border-emerald-500 focus:outline-none transition resize-none"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                    <Keyboard className="w-8 h-8 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Syntax Sprint Complete!</h2>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 inline-block px-8">
                    <div className="text-xs text-slate-400 uppercase font-bold">Speed Achieved</div>
                    <div className="text-3xl font-black text-emerald-400">{racerWpm} WPM</div>
                  </div>
                  <div>
                    <button
                      onClick={resetRacer}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:scale-105 transition flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw className="w-4 h-4" /> Race Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. MEMORY MATRIX GAME */}
          {/* ======================================================== */}
          {activeTab === "memory" && (
            <div className="space-y-6">
              {!memoryGameOver ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs sm:text-sm">
                    <div className="font-bold text-slate-400">
                      Match DS Concept with its Time Complexity
                    </div>
                    <div className="font-extrabold text-amber-400">Moves: {memoryMoves}</div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {cards.map((card) => {
                      const isFlipped =
                        flippedCards.some((c) => c.uniqueId === card.uniqueId) ||
                        matchedCards.includes(card.uniqueId);

                      return (
                        <button
                          key={card.uniqueId}
                          onClick={() => handleCardClick(card)}
                          className={`h-24 sm:h-28 rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center p-3 text-center ${
                            isFlipped
                              ? "bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-lg shadow-amber-500/10 scale-105"
                              : "bg-slate-950/80 border-white/10 text-slate-500 hover:border-amber-500/40 hover:bg-slate-900"
                          }`}
                        >
                          {isFlipped ? card.text : <Brain className="w-6 h-6 text-slate-600" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                    <Award className="w-8 h-8 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Memory Matrix Solved!</h2>
                  <p className="text-slate-400 text-sm">
                    Completed in <span className="font-extrabold text-amber-300">{memoryMoves} Moves</span>!
                  </p>
                  <button
                    onClick={resetMemoryGame}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:scale-105 transition flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" /> Restart Matrix
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
