import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { createChatSession } from "@/utils/GeminiAIModal";
import { rateLimit } from "@/utils/rateLimit";

// POST /api/interviews/[id]/answer — evaluate answer with Gemini and save to DB
export async function POST(request, { params }) {
  try {
    // Auth is graceful — allow guest submissions
    let userId = "guest_user";
    let userEmail = "candidate@prep-ai.com";
    try {
      const authResult = await auth();
      if (authResult?.userId) userId = authResult.userId;
      const user = await currentUser();
      if (user?.primaryEmailAddress?.emailAddress) {
        userEmail = user.primaryEmailAddress.emailAddress;
      }
    } catch (_) {}

    // Rate limit: 30 answers per 5 minutes per user
    const rl = rateLimit(`record-answer:${userId}`, { limit: 30, windowMs: 5 * 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { question, correctAns, userAns } = body;

    if (!question || !userAns) {
      return NextResponse.json({ error: "question and userAns are required" }, { status: 400 });
    }

    // Build PREP-AI feedback prompt (supports code and conceptual answers)
    const feedbackPrompt = `You are PREP-AI, an expert Principal Engineer and Technical Interviewer.
Evaluate the candidate's answer/code solution for the following technical question:

Technical Question: ${question}
Ideal / Reference Solution: ${correctAns}
Candidate's Submission:
${userAns}

Instructions:
1. Evaluate the candidate's code correctness, algorithmic approach, Big-O time & space efficiency, edge cases, and clarity.
2. Provide a constructive rating from 1 to 10 (integer or float).
3. Provide a concise, highly actionable evaluation (3-5 sentences) highlighting key strengths and areas of optimization.
4. Output MUST be valid JSON only in this exact format:
{
  "rating": 8,
  "feedback": "Your concise evaluation and optimization tips here."
}`;

    const session = createChatSession();
    const aiResult = await session.sendMessage(feedbackPrompt);
    let responseText = aiResult.response.text();

    const cleanedResponse = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let feedbackJson;
    try {
      feedbackJson = JSON.parse(cleanedResponse);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI feedback. Please try again." },
        { status: 502 }
      );
    }

    const createdAt = new Date().toISOString().split("T")[0];

    await db.insert(UserAnswer).values({
      mockIdRef: id,
      question,
      correctAns: correctAns ?? "",
      userAns,
      feedback: feedbackJson?.feedback ?? "",
      rating: String(feedbackJson?.rating ?? "0"),
      userEmail,
      createdAt,
    });

    return NextResponse.json({
      feedback: feedbackJson.feedback,
      rating: feedbackJson.rating,
    });
  } catch (error) {
    console.error("[POST /api/interviews/[id]/answer]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
