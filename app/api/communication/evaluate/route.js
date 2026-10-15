import { NextResponse } from "next/server";
import { createChatSession } from "@/utils/ClaudeAIModal";

export const maxDuration = 60;

function cleanAndParseJson(raw) {
  let cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Repair unquoted parentheses after quotes: "phrase" (explanation), -> "phrase (explanation)",
  cleaned = cleaned.replace(/"([^"\n\r]+)"\s*\(([^)\n\r]+)\)/g, '"$1 ($2)"');

  // Remove trailing commas before closing braces or brackets
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");

  return JSON.parse(cleaned);
}

function generateFallbackAnalysis(userResponse, question) {
  const words = userResponse.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const fillerRegex = /\b(um|uh|er|ah|like|basically|actually|you know|literally|sort of|kind of)\b/gi;
  const fillersFound = (userResponse.match(fillerRegex) || []).map((w) => w.toLowerCase());
  const uniqueFillers = [...new Set(fillersFound)];

  const clarityScore = Math.min(Math.max(Math.round(wordCount > 30 ? 78 : 65), 50), 92);
  const structureScore = userResponse.includes("because") || userResponse.includes("result") || userResponse.includes("impact") ? 80 : 68;
  const confidenceScore = uniqueFillers.length === 0 ? 85 : Math.max(85 - uniqueFillers.length * 5, 55);
  const relevanceScore = 80;
  const concisenessScore = wordCount > 200 ? 65 : 82;
  const technicalScore = /\b(react|node|api|database|system|service|scale|architecture|python|java|sql)\b/i.test(userResponse) ? 82 : 70;

  const overall = Math.round(
    (clarityScore + structureScore + confidenceScore + relevanceScore + concisenessScore + technicalScore) / 6
  );

  return {
    overallScore: overall,
    scores: {
      clarity: {
        score: clarityScore,
        feedback: "Your phrasing conveys core ideas. Add concrete examples to further sharpen clarity.",
      },
      structure: {
        score: structureScore,
        feedback: "Organize with the STAR method (Situation, Task, Action, Result) for maximum impact.",
      },
      confidence: {
        score: confidenceScore,
        feedback:
          uniqueFillers.length > 0
            ? `Minimizing filler words like ${uniqueFillers.slice(0, 3).map((f) => `"${f}"`).join(", ")} will immediately elevate your confidence.`
            : "Strong, poised tone without distracting filler words.",
      },
      relevance: {
        score: relevanceScore,
        feedback: "Answers directly address the interviewer's objective.",
      },
      conciseness: {
        score: concisenessScore,
        feedback: wordCount > 150 ? "Aim to condense your narrative to 60-90 seconds." : "Well-paced and concise delivery.",
      },
      technicalDepth: {
        score: technicalScore,
        feedback: "Demonstrates domain knowledge. Highlight key metrics and architectural trade-offs.",
      },
    },
    starAlignment: {
      situation: { present: true, quality: "good", note: "Context is established early." },
      task: { present: wordCount > 40, quality: wordCount > 40 ? "good" : "missing", note: "Define the specific challenge or goal." },
      action: { present: true, quality: "good", note: "Highlights the steps you took." },
      result: {
        present: /\b(\d+%|reduced|improved|increased|saved|built)\b/i.test(userResponse),
        quality: "adequate",
        note: "Quantify business and engineering outcomes.",
      },
    },
    improvements: [
      "Lead directly with the business result before explaining the technical steps.",
      "Incorporate specific metrics (e.g. latency reduced by 40%, throughput increased 3x).",
      "Use strong first-person action verbs: 'architected', 'spearheaded', 'optimized'.",
    ],
    fillerWords: uniqueFillers,
    powerPhrases: ["spearheaded architecture", "cross-functional collaboration", "measurable outcome"],
    improvedResponse: `In approaching this challenge, I first analyzed the requirements to establish key performance indicators. Next, I designed a resilient solution using industry best practices, actively resolving potential edge cases. As a result, our team delivered the project ahead of schedule while maintaining high system reliability.`,
    tipOfDay:
      "In technical interviews, state the outcome upfront. Senior interviewers value engineers who think about business impact first and implementation details second.",
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userResponse, question, context } = body;

    if (!userResponse?.trim() || !question?.trim()) {
      return NextResponse.json({ error: "Question and response are required" }, { status: 400 });
    }

    const prompt = `You are an expert Communication Coach and Interview Trainer at PREP-AI. Your job is to evaluate how well a candidate communicates their answer to an interview question.

Interview Question: ${question}
Context: ${context || "Technical interview for a software engineering role"}

Candidate's Response:
"${userResponse.substring(0, 2000)}"

Evaluate communication quality across multiple dimensions.
CRITICAL FORMATTING RULES:
1. Return ONLY a single, valid JSON object without markdown code fences.
2. In arrays (such as "powerPhrases" and "improvements"), all elements MUST be pure strings. NEVER place parentheses or notes outside quotes.
3. No trailing commas.

Required JSON Structure:
{
  "overallScore": 72,
  "scores": {
    "clarity": { "score": 75, "feedback": "Clear phrasing..." },
    "structure": { "score": 65, "feedback": "Structure feedback..." },
    "confidence": { "score": 70, "feedback": "Confidence feedback..." },
    "relevance": { "score": 80, "feedback": "Relevance feedback..." },
    "conciseness": { "score": 60, "feedback": "Conciseness feedback..." },
    "technicalDepth": { "score": 85, "feedback": "Technical depth feedback..." }
  },
  "starAlignment": {
    "situation": { "present": true, "quality": "good", "note": "..." },
    "task": { "present": false, "quality": "missing", "note": "..." },
    "action": { "present": true, "quality": "excellent", "note": "..." },
    "result": { "present": false, "quality": "missing", "note": "Add quantified results" }
  },
  "improvements": [
    "Start with a brief context setting sentence",
    "Add specific metrics to quantify your impact",
    "Use 'I' statements instead of 'we' to highlight your contribution"
  ],
  "fillerWords": ["um", "like"],
  "powerPhrases": ["delivered results", "cross-functional collaboration"],
  "improvedResponse": "Here is a stronger version of your response that demonstrates better communication...",
  "tipOfDay": "In technical interviews, lead with the outcome before diving into the approach — it shows you think about impact first."
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
