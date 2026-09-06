import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createChatSession } from "@/utils/GeminiAIModal";

// POST /api/leetcode/evaluate — evaluates DSA code submissions
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { problemTitle, problemDesc, language, userCode, constraints } = body;

    if (!problemTitle || !userCode?.trim()) {
      return NextResponse.json({ error: "Problem title and code are required" }, { status: 400 });
    }

    const prompt = `You are a Principal Software Engineer and Competitive Programming / LeetCode Judge for PREP-AI.
Evaluate the following DSA code submission:

Problem: ${problemTitle}
Description: ${problemDesc}
Constraints: ${constraints || "Standard LeetCode constraints"}
Language: ${language || "JavaScript"}

Candidate's Code Submission:
\`\`\`${language || "javascript"}
${userCode}
\`\`\`

Instructions:
1. Verify algorithmic correctness and edge case handling (empty input, negatives, large arrays, boundaries).
2. Determine Time Complexity (Big-O) and Space Complexity (Big-O).
3. Check if the submission would pass all standard LeetCode test cases (Verdict: "Accepted", "Wrong Answer", "Time Limit Exceeded", or "Compile Error").
4. Provide test case results, a score out of 10, clear optimization feedback, and a clean optimal reference snippet if needed.
5. Return ONLY a valid JSON object in this exact format:
{
  "verdict": "Accepted",
  "score": 9.5,
  "timeComplexity": "O(N log N)",
  "spaceComplexity": "O(1)",
  "passedCases": "15 / 15",
  "runtimeMs": "42ms (Faster than 88.4%)",
  "memoryMb": "44.2MB (Better than 91.2%)",
  "feedback": "Your concise, insightful feedback explaining strengths and potential edge cases or micro-optimizations.",
  "optimalSnippet": "// Optimal code snippet if applicable"
}`;

    const session = createChatSession();
    const result = await session.sendMessage(prompt);
    const responseText = result.response.text();

    const cleanedJson = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const evalData = JSON.parse(cleanedJson);
    return NextResponse.json(evalData);
  } catch (error) {
    console.error("[POST /api/leetcode/evaluate]", error);
    return NextResponse.json(
      { error: "Failed to evaluate code. Please verify your syntax and try again." },
      { status: 500 }
    );
  }
}
