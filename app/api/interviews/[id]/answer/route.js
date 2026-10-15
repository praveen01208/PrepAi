import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { createChatSession, cleanAndParseJson } from "@/utils/ClaudeAIModal";
import { rateLimit } from "@/utils/rateLimit";

export const maxDuration = 60;

// POST /api/interviews/[id]/answer — evaluate answer with Claude and save to DB
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
    const feedbackPrompt = `You are PREP-AI, an expert Principal Engineer and Senior Technical Interviewer.
Deeply evaluate the candidate's answer against the technical question and reference solution.

Technical Question:
${question}

Ideal / Reference Solution:
${correctAns || "Comprehensive technical answer covering fundamentals, time/space efficiency, and edge cases."}

Candidate's Submission:
${userAns}

RIGOROUS CALIBRATED RATING GUIDELINES (Scale 1 to 10):
- 1 to 2: Off-topic, gibberish, blank, evasive, or completely incorrect.
- 3 to 4: Shallow, mentions buzzwords without explaining mechanisms, or significant errors.
- 5 to 6: Basic understanding of the concept, but lacks trade-offs or has minor inaccuracies.
- 7 to 8: Strong, correct technical answer covering the main requirements clearly.
- 9 to 10: Exceptional, comprehensive explanation addressing Big-O complexities, edge cases, and architectural best practices.
- DO NOT default to a middle rating. Evaluate the ACTUAL accuracy of the candidate's submission.

Output MUST be valid JSON only matching this schema:
{
  "rating": 7.5,
  "feedback": "Specific 3-5 sentence analysis directly referencing what the candidate said, highlighting concrete strengths and actionable improvements."
}`;

    const session = createChatSession();
    const aiResult = await session.sendMessage(feedbackPrompt);
    let responseText = aiResult.response.text();

    let feedbackJson;
    try {
      feedbackJson = cleanAndParseJson(responseText);
    } catch (parseErr) {
      console.warn("[POST /api/interviews/[id]/answer] Parsing fallback activated:", parseErr.message);
      const isGibberish = userAns.trim().length < 10;
      feedbackJson = {
        rating: isGibberish ? 2 : 6,
        feedback: isGibberish
          ? "The answer did not sufficiently address the technical question. Please formulate a complete solution."
          : "Your response touches upon the main idea. Focus on detailing the underlying algorithmic steps and complexity trade-offs.",
      };
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
