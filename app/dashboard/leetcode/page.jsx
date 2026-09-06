"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Code2,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Send,
  Cpu,
  Layers,
  Filter,
  Search,
  Zap,
  RotateCcw,
  Trophy,
  Star,
  ExternalLink,
  Tag,
  Clock,
  Check,
  ChevronRight,
  BookOpen,
  Building2,
  Flame,
  Award,
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

// Curated LeetCode & College Placement Problem Dataset with Authentic Blank Starter Templates
const PROBLEMS = [
  {
    id: 1,
    number: "001",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companies: ["Google", "Amazon", "Microsoft", "Meta", "TCS Digital"],
    acceptance: "52.4%",
    desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
  
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your code here
  
}`,
      go: `func twoSum(nums []int, target int) []int {
    // Write your code here
    return nil
}`,
    },
  },
  {
    id: 2,
    number: "003",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    companies: ["Amazon", "Microsoft", "Apple", "Uber", "Infosys DSE"],
    acceptance: "34.8%",
    desc: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
    ],
    constraints: "0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces.",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your code here
  
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your code here
        pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
        return 0;
    }
};`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Write your code here
  
}`,
      go: `func lengthOfLongestSubstring(s string) int {
    // Write your code here
    return 0
}`,
    },
  },
  {
    id: 3,
    number: "015",
    title: "3Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    companies: ["Meta", "Amazon", "Apple", "Product Startups"],
    acceptance: "33.9%",
    desc: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
    ],
    constraints: "3 <= nums.length <= 3000, -10^5 <= nums[i] <= 10^5",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Write your code here
  
}`,
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        # Write your code here
        pass`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your code here
        return {};
    }
};`,
      typescript: `function threeSum(nums: number[]): number[][] {
  // Write your code here
  
}`,
      go: `func threeSum(nums []int) [][]int {
    // Write your code here
    return nil
}`,
    },
  },
  {
    id: 4,
    number: "020",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    companies: ["Google", "Amazon", "Microsoft", "TCS Ninja", "Cognizant"],
    acceptance: "41.2%",
    desc: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets and in the correct order.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: "1 <= s.length <= 10^4",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your code here
  
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your code here
        pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        return false;
    }
};`,
      typescript: `function isValid(s: string): boolean {
  // Write your code here
  
}`,
      go: `func isValid(s string) bool {
    // Write your code here
    return false
}`,
    },
  },
  {
    id: 5,
    number: "121",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companies: ["Google", "Amazon", "Microsoft", "Meta", "Wipro"],
    acceptance: "54.1%",
    desc: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
    ],
    constraints: "1 <= prices.length <= 10^5, 0 <= prices[i] <= 10^4",
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // Write your code here
  
}`,
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # Write your code here
        pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your code here
        return 0;
    }
};`,
      typescript: `function maxProfit(prices: number[]): number {
  // Write your code here
  
}`,
      go: `func maxProfit(prices []int) int {
    // Write your code here
    return 0
}`,
    },
  },
  {
    id: 6,
    number: "146",
    title: "LRU Cache",
    difficulty: "Medium",
    category: "Design",
    companies: ["Google", "Amazon", "Microsoft", "Uber", "Apple"],
    acceptance: "42.0%",
    desc: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with get(key) and put(key, value) in O(1) average time complexity.",
    examples: [
      { input: '["LRUCache", "put", "put", "get", "put", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2]]', output: "[null, null, null, 1, null, -1]" },
    ],
    constraints: "1 <= capacity <= 3000, 0 <= key, value <= 10^4",
    starterCode: {
      javascript: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    // Initialize data structures
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    // Write your code here
    return -1;
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    // Write your code here
  }
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        # Initialize your cache here
        pass

    def get(self, key: int) -> int:
        # Write your code here
        return -1

    def put(self, key: int, value: int) -> None:
        # Write your code here
        pass`,
      java: `class LRUCache {
    public LRUCache(int capacity) {
        // Initialize your cache here
    }
    
    public int get(int key) {
        // Write your code here
        return -1;
    }
    
    public void put(int key, int value) {
        // Write your code here
    }
}`,
      cpp: `class LRUCache {
public:
    LRUCache(int capacity) {
        // Initialize your cache here
    }
    
    int get(int key) {
        // Write your code here
        return -1;
    }
    
    void put(int key, int value) {
        // Write your code here
    }
};`,
      typescript: `class LRUCache {
  constructor(capacity: number) {
    // Initialize your cache here
  }

  get(key: number): number {
    // Write your code here
    return -1;
  }

  put(key: number, value: number): void {
    // Write your code here
  }
}`,
      go: `type LRUCache struct {
    // define fields
}

func Constructor(capacity int) LRUCache {
    return LRUCache{}
}

func (this *LRUCache) Get(key int) int {
    return -1
}

func (this *LRUCache) Put(key int, value int) {
    // Write your code here
}`,
    },
  },
  {
    id: 7,
    number: "200",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graphs",
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Bloomberg"],
    acceptance: "58.7%",
    desc: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: "2" },
    ],
    constraints: "m == grid.length, n == grid[i].length, 1 <= m, n <= 300",
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Write your code here
  
}`,
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        # Write your code here
        pass`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your code here
        return 0;
    }
};`,
      typescript: `function numIslands(grid: string[][]): number {
  // Write your code here
  
}`,
      go: `func numIslands(grid [][]byte) int {
    // Write your code here
    return 0
}`,
    },
  },
  {
    id: 8,
    number: "042",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Two Pointers",
    companies: ["Google", "Amazon", "Goldman Sachs", "Meta"],
    acceptance: "60.4%",
    desc: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: "n == height.length, 1 <= n <= 2 * 10^4",
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // Write your code here
  
}`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        # Write your code here
        pass`,
      java: `class Solution {
    public int trap(int[] height) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        // Write your code here
        return 0;
    }
};`,
      typescript: `function trap(height: number[]): number {
  // Write your code here
  
}`,
      go: `func trap(height []int) int {
    // Write your code here
    return 0
}`,
    },
  },
  {
    id: 9,
    number: "070",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    companies: ["Amazon", "Google", "Adobe", "Accenture", "TCS"],
    acceptance: "52.8%",
    desc: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" },
      { input: "n = 3", output: "3" },
    ],
    constraints: "1 <= n <= 45",
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Write your code here
  
}`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your code here
        pass`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        return 0;
    }
};`,
      typescript: `function climbStairs(n: number): number {
  // Write your code here
  
}`,
      go: `func climbStairs(n int) int {
    // Write your code here
    return 0
}`,
    },
  },
  {
    id: 10,
    number: "322",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companies: ["Amazon", "Microsoft", "Apple", "Flipkart", "Infosys"],
    acceptance: "43.5%",
    desc: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    constraints: "1 <= coins.length <= 12, 1 <= coins[i] <= 2^31 - 1, 0 <= amount <= 10^4",
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Write your code here
  
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # Write your code here
        pass`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        return -1;
    }
}`,
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your code here
        return -1;
    }
};`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  // Write your code here
  
}`,
      go: `func coinChange(coins []int, amount int) int {
    // Write your code here
    return -1
}`,
    },
  },
];

const CATEGORIES = [
  "All Topics",
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Graphs",
  "Dynamic Programming",
  "Design",
];

const COMPANIES = [
  "All Companies",
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Uber",
  "TCS Digital",
  "Infosys DSE",
];

const LeetCodeArena = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProblem, setActiveProblem] = useState(null);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [userCode, setUserCode] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [solvedIds, setSolvedIds] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("prep_ai_solved_problems") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  const openProblemModal = (prob) => {
    setActiveProblem(prob);
    setUserCode(prob.starterCode[selectedLang] || prob.starterCode["javascript"] || "");
    setEvalResult(null);
  };

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    if (activeProblem?.starterCode?.[lang]) {
      setUserCode(activeProblem.starterCode[lang]);
    }
  };

  const handleEvaluateSubmission = async () => {
    if (!userCode.trim()) {
      toast.warning("Please type your solution code first.");
      return;
    }
    try {
      setEvaluating(true);
      const res = await fetch("/api/leetcode/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: activeProblem.title,
          problemDesc: activeProblem.desc,
          language: selectedLang,
          userCode,
          constraints: activeProblem.constraints,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to evaluate code");

      setEvalResult(data);

      if (data.verdict === "Accepted") {
        toast.success(`🎉 Accepted! Score: ${data.score}/10`);
        const updated = Array.from(new Set([...solvedIds, activeProblem.id]));
        setSolvedIds(updated);
        localStorage.setItem("prep_ai_solved_problems", JSON.stringify(updated));
      } else {
        toast.error(`Verdict: ${data.verdict}`);
      }
    } catch (err) {
      toast.error(err.message || "Evaluation error.");
    } finally {
      setEvaluating(false);
    }
  };

  // Filter problems
  const filteredProblems = PROBLEMS.filter((p) => {
    const matchesCat = selectedCategory === "All Topics" || p.category === selectedCategory;
    const matchesComp = selectedCompany === "All Companies" || p.companies.includes(selectedCompany);
    const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesComp && matchesDiff && matchesSearch;
  });

  const easySolved = solvedIds.filter((id) => PROBLEMS.find((p) => p.id === id)?.difficulty === "Easy").length;
  const medSolved = solvedIds.filter((id) => PROBLEMS.find((p) => p.id === id)?.difficulty === "Medium").length;
  const hardSolved = solvedIds.filter((id) => PROBLEMS.find((p) => p.id === id)?.difficulty === "Hard").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner with LeetCode Style Scorecard */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-cyan-500/10 to-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>PREP-AI DSA &amp; LEETCODE ARENA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Competitive DSA &amp; Placement Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Solve curated problems asked at top product firms and campus placement drives. Write your solution from scratch, test with sample cases, and receive instant Big-O analysis.
            </p>
          </div>

          {/* LeetCode Solved Progress Stats */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 shrink-0">
            <div className="flex flex-col items-center p-2 text-center">
              <span className="text-xs font-bold text-emerald-500 uppercase">Easy</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {easySolved} <span className="text-xs text-slate-400 font-normal">/ 3</span>
              </span>
            </div>
            <div className="flex flex-col items-center p-2 text-center border-x border-slate-200 dark:border-white/10">
              <span className="text-xs font-bold text-amber-500 uppercase">Medium</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {medSolved} <span className="text-xs text-slate-400 font-normal">/ 5</span>
              </span>
            </div>
            <div className="flex flex-col items-center p-2 text-center">
              <span className="text-xs font-bold text-rose-500 uppercase">Hard</span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {hardSolved} <span className="text-xs text-slate-400 font-normal">/ 2</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 space-y-4">
        {/* Search & Difficulty */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem by name or topic..."
              className="pl-10 rounded-2xl glass-input text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDifficulty === d
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                  : "glass-card text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problem List Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200/60 dark:border-white/10">
              <tr>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Title</th>
                <th className="py-4 px-5">Topic</th>
                <th className="py-4 px-5">Difficulty</th>
                <th className="py-4 px-5">Companies</th>
                <th className="py-4 px-5">Acceptance</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {filteredProblems.map((prob) => {
                const isSolved = solvedIds.includes(prob.id);
                return (
                  <tr
                    key={prob.id}
                    className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => openProblemModal(prob)}
                  >
                    <td className="py-4 px-5">
                      {isSolved ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 block ml-1" />
                      )}
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition">
                      <span className="text-slate-400 mr-1.5">#{prob.number}.</span>
                      {prob.title}
                    </td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-300 font-medium">
                      {prob.category}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                          prob.difficulty === "Easy"
                            ? "text-emerald-400 bg-emerald-500/10"
                            : prob.difficulty === "Medium"
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-rose-400 bg-rose-500/10"
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {prob.companies.slice(0, 2).map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 text-[10px]"
                          >
                            {c}
                          </span>
                        ))}
                        {prob.companies.length > 2 && (
                          <span className="text-[10px] text-slate-400">+{prob.companies.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-400 font-mono">{prob.acceptance}</td>
                    <td className="py-4 px-5 text-right">
                      <Button
                        size="sm"
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-sm hover:scale-105 transition"
                      >
                        Solve <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LeetCode Interactive Code Workspace Dialog */}
      <Dialog open={!!activeProblem} onOpenChange={(open) => !open && setActiveProblem(null)}>
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] rounded-3xl p-0 overflow-y-auto lg:overflow-hidden glass-panel border border-white/60 dark:border-white/10 shadow-2xl">
          {activeProblem && (
            <div className="flex flex-col min-h-0 lg:h-[85vh]">
              {/* Top Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900/90 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    #{activeProblem.number}
                  </div>
                  <div>
                    <DialogTitle className="text-sm sm:text-lg font-black text-white">
                      {activeProblem.title}
                    </DialogTitle>
                    <DialogDescription className="text-[11px] sm:text-xs text-slate-400">
                      {activeProblem.category} • {activeProblem.difficulty}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedLang}
                    onChange={(e) => handleLangChange(e.target.value)}
                    className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl glass-input text-slate-200 cursor-pointer"
                  >
                    <option value="javascript" className="bg-slate-900">JavaScript</option>
                    <option value="typescript" className="bg-slate-900">TypeScript</option>
                    <option value="python" className="bg-slate-900">Python</option>
                    <option value="java" className="bg-slate-900">Java</option>
                    <option value="cpp" className="bg-slate-900">C++</option>
                    <option value="go" className="bg-slate-900">Go</option>
                  </select>
                </div>
              </div>

              {/* Body: Split View (Problem Description Left + Code Editor Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-0 lg:overflow-hidden">
                {/* Left Description Pane */}
                <div className="lg:col-span-5 p-4 sm:p-6 lg:overflow-y-auto space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-white/10 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase text-[11px] mb-2">Description</h4>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
                      {activeProblem.desc}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-400 uppercase text-[11px]">Sample Examples</h4>
                    {activeProblem.examples.map((ex, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 font-mono text-[11px] space-y-1">
                        <p><span className="text-cyan-400 font-bold">Input:</span> {ex.input}</p>
                        <p><span className="text-emerald-400 font-bold">Output:</span> {ex.output}</p>
                        {ex.explanation && (
                          <p className="text-slate-400 font-sans text-[10px] mt-1">{ex.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase text-[11px] mb-1.5">Constraints</h4>
                    <p className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      {activeProblem.constraints}
                    </p>
                  </div>

                  {/* Company Tags */}
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase text-[11px] mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Target Companies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProblem.companies.map((c, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg glass-card font-semibold text-[10px] text-slate-600 dark:text-slate-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Code Editor & Result Pane */}
                <div className="lg:col-span-7 flex flex-col justify-between lg:overflow-hidden bg-slate-950 p-4 space-y-3 min-h-[380px] lg:min-h-0">
                  <div className="relative rounded-xl overflow-hidden glass-terminal border border-white/10 flex-1 flex flex-col min-h-[220px]">
                    <div className="px-4 py-2 bg-slate-900/80 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>solution.{selectedLang === "python" ? "py" : selectedLang === "java" ? "java" : selectedLang === "cpp" ? "cpp" : selectedLang === "go" ? "go" : selectedLang === "typescript" ? "ts" : "js"}</span>
                      <span className="text-cyan-400/80">Type your code inside the template</span>
                    </div>

                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      rows={14}
                      className="w-full flex-1 p-4 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none"
                      spellCheck={false}
                      placeholder="// Type your code here..."
                    />
                  </div>

                  {/* Verdict & Feedback Output */}
                  {evalResult && (
                    <div className="p-3.5 rounded-xl glass-card border border-white/10 space-y-2 animate-in fade-in duration-200 max-h-48 overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase ${
                              evalResult.verdict === "Accepted"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {evalResult.verdict}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            Cases: {evalResult.passedCases}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                          <span>Time: {evalResult.timeComplexity}</span>
                          <span>Space: {evalResult.spaceComplexity}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {evalResult.feedback}
                      </p>
                    </div>
                  )}

                  {/* Bottom Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserCode(activeProblem.starterCode[selectedLang] || activeProblem.starterCode["javascript"] || "")}
                      className="rounded-xl text-xs text-slate-400 hover:text-slate-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Template
                    </Button>

                    <Button
                      onClick={handleEvaluateSubmission}
                      disabled={evaluating}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white font-black text-xs px-6 py-2.5 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
                    >
                      {evaluating ? (
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 animate-spin" />
                          Running PREP-AI Judge...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5" /> Submit Solution
                        </span>
                      )}
                    </Button>
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

export default LeetCodeArena;
