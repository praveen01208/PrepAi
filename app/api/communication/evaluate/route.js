import { NextResponse } from "next/server";
import { createChatSession, cleanAndParseJson } from "@/utils/ClaudeAIModal";

export const maxDuration = 60;

function generateFallbackAnalysis(userResponse, question) {
  const words = userResponse.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const fillerRegex = /\b(um|uh|er|ah|like|basically|actually|you know|literally|sort of|kind of)\b/gi;
  const fillersFound = (userResponse.match(fillerRegex) || []).map((w) => w.toLowerCase());
  const uniqueFillers = [...new Set(fillersFound)];

  const isNonsensical = wordCount < 5 || /(asdf|qwer|test|bla|xyz)/i.test(userResponse);

  const clarityScore = isNonsensical ? 15 : Math.min(Math.max(Math.round(wordCount > 30 ? 76 : 58), 25), 90);
  const structureScore = isNonsensical ? 10 : (userResponse.includes("because") || userResponse.includes("result") || userResponse.includes("impact") ? 78 : 60);
  const confidenceScore = isNonsensical ? 20 : (uniqueFillers.length === 0 ? 82 : Math.max(82 - uniqueFillers.length * 6, 45));
  const relevanceScore = isNonsensical ? 10 : 65;
  const concisenessScore = wordCount > 250 ? 55 : (isNonsensical ? 20 : 75);
  const technicalScore = /\b(react|node|api|database|system|service|scale|architecture|python|java|sql|docker|cloud)\b/i.test(userResponse) ? 80 : (isNonsensical ? 10 : 55);

  const overall = Math.round(
    (clarityScore + structureScore + confidenceScore + relevanceScore + concisenessScore + technicalScore) / 6
  );

  return {
    overallScore: overall,
    scores: {
      clarity: {
        score: clarityScore,
        feedback: isNonsensical
          ? "The answer lacks clear communication and does not formulate an intelligible response."
          : "Your thoughts are understandable. Provide concrete technical details to elevate clarity.",
      },
      structure: {
        score: structureScore,
        feedback: "Structure your thoughts using the STAR framework (Situation, Task, Action, Result).",
      },
      confidence: {
        score: confidenceScore,
        feedback:
          uniqueFillers.length > 0
            ? `Work on reducing filler words such as ${uniqueFillers.slice(0, 3).map((f) => `"${f}"`).join(", ")} to sound more decisive.`
            : "Direct delivery with steady pacing.",
      },
      relevance: {
        score: relevanceScore,
        feedback: isNonsensical
          ? "The submission did not address the question asked."
          : "Directly tie your answer back to the problem statement.",
      },
      conciseness: {
        score: concisenessScore,
        feedback: wordCount > 200 ? "Try focusing on key accomplishments and keep your answer within 90 seconds." : "Good response length.",
      },
      technicalDepth: {
        score: technicalScore,
        feedback: "Include specific architectural patterns, metrics, and measurable business impact.",
      },
    },
    starAlignment: {
      situation: { present: !isNonsensical, quality: isNonsensical ? "missing" : "adequate", note: "Context setup" },
      task: { present: wordCount > 35, quality: wordCount > 35 ? "good" : "missing", note: "Challenge identification" },
      action: { present: !isNonsensical, quality: isNonsensical ? "missing" : "good", note: "Execution steps" },
      result: {
        present: /\b(\d+%|reduced|improved|increased|saved|built|achieved)\b/i.test(userResponse),
        quality: "adequate",
        note: "Quantifiable outcomes",
      },
    },
    improvements: [
      "Explicitly answer the question in the opening sentence before giving background.",
      "Quantify your accomplishments with measurable metrics (latency, revenue, user count).",
      "Explain the trade-offs of the engineering decisions you made.",
    ],
    fillerWords: uniqueFillers,
    powerPhrases: ["spearheaded architecture", "cross-functional collaboration", "measurable outcome"],
    improvedResponse: `When addressing this challenge in my previous role, I first identified the root constraint. I implemented an optimized solution that reduced latency by 35% and improved overall team productivity.`,
    tipOfDay:
      "In technical interviews, state the outcome upfront. Interviewers retain measurable results much better than procedural steps.",
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userResponse, question, context } = body;

    if (!userResponse?.trim() || !question?.trim()) {
      return NextResponse.json({ error: "Question and response are required" }, { status: 400 });
    }

    const prompt = `You are an expert Executive Communication Coach and Principal Technical Interviewer at PREP-AI.
Your goal is to deeply analyze the candidate's response to the given interview question.

CRITICAL INSTRUCTIONS:
1. Carefully compare the Candidate's Response against the Interview Question to determine if they actually answered it with appropriate depth.
2. RIGOROUS REALISTIC SCORING (DO NOT output fixed, generic, or arbitrary scores):
   - Irrelevant, nonsensical, gibberish, evasive, or "I don't know" responses MUST score between 5 and 25 overall.
   - Very brief or superficial responses (lacking explanation, context, or depth) score between 35 and 55.
   - Competent, clear responses that answer the question well score between 70 and 85.
   - Comprehensive, compelling responses with STAR structure, specific metrics, and clear impact score between 86 and 98.
   - Every single number and feedback sentence MUST directly reflect the candidate's actual words and concepts.

Interview Question: ${question}
Context: ${context || "Technical interview for a software engineering role"}

Candidate's Response:
"${userResponse.substring(0, 3000)}"

Return ONLY a single valid JSON object with NO markdown fences, matching this schema:
{
  "overallScore": 75,
  "scores": {
    "clarity": { "score": 75, "feedback": "Detailed feedback on clarity..." },
    "structure": { "score": 70, "feedback": "Detailed feedback on structure..." },
    "confidence": { "score": 72, "feedback": "Detailed feedback on confidence..." },
    "relevance": { "score": 80, "feedback": "Detailed feedback on relevance to this specific question..." },
    "conciseness": { "score": 74, "feedback": "Detailed feedback on conciseness..." },
    "technicalDepth": { "score": 78, "feedback": "Detailed feedback on technical depth..." }
  },
  "starAlignment": {
    "situation": { "present": true, "quality": "good", "note": "Notes on situation..." },
    "task": { "present": true, "quality": "good", "note": "Notes on task..." },
    "action": { "present": true, "quality": "good", "note": "Notes on action..." },
    "result": { "present": false, "quality": "missing", "note": "Notes on results..." }
  },
  "improvements": [
    "Specific improvement 1 based on their answer",
    "Specific improvement 2 based on their answer",
    "Specific improvement 3 based on their answer"
  ],
  "fillerWords": ["um", "like"],
  "powerPhrases": ["strong phrase used in answer"],
  "improvedResponse": "An expertly tailored rewrite of their response specifically answering this question with STAR framework and metrics.",
  "tipOfDay": "Tailored actionable coaching tip relevant to this question."
}`;

    let analysis = null;
    try {
      const session = createChatSession();
      const result = await session.sendMessage(prompt);
      const responseText = result.response.text();
      analysis = cleanAndParseJson(responseText);
    } catch (aiErr) {
      console.warn("[POST /api/communication/evaluate] AI evaluation fallback activated:", aiErr?.message);
    }

    if (!analysis || typeof analysis.overallScore === "undefined" || !analysis.scores) {
      analysis = generateFallbackAnalysis(userResponse, question);
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[POST /api/communication/evaluate]", error);
    return NextResponse.json(
      generateFallbackAnalysis("Practice response", "Interview question")
    );
  }
}
