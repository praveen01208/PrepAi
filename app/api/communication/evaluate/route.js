import { NextResponse } from "next/server";
import { createChatSession } from "@/utils/GeminiAIModal";

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

Evaluate communication quality across multiple dimensions. Return ONLY a valid JSON object:
{
  "overallScore": 72,
  "scores": {
    "clarity": { "score": 75, "feedback": "..." },
    "structure": { "score": 65, "feedback": "..." },
    "confidence": { "score": 70, "feedback": "..." },
    "relevance": { "score": 80, "feedback": "..." },
    "conciseness": { "score": 60, "feedback": "..." },
    "technicalDepth": { "score": 85, "feedback": "..." }
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
  "fillerWords": ["um", "like", "you know"],
  "powerPhrases": ["delivered results", "cross-functional collaboration"],
  "improvedResponse": "Here is a stronger version of your response that demonstrates better communication: ...",
  "tipOfDay": "In technical interviews, lead with the outcome before diving into the approach — it shows you think about impact first."
}`;

    const session = createChatSession();
    const result = await session.sendMessage(prompt);
    const responseText = result.response.text();
    const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(cleaned);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[POST /api/communication/evaluate]", error);
    return NextResponse.json({ error: "Failed to evaluate communication. Please try again." }, { status: 500 });
  }
}
