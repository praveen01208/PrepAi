import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { AdaptiveInterview, AdaptiveQuestion } from "@/utils/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/interviews/adaptive/[sessionId]
export async function GET(request, { params }) {
  try {
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    try {
      const sessionList = await db
        .select()
        .from(AdaptiveInterview)
        .where(eq(AdaptiveInterview.sessionId, sessionId));

      if (sessionList && sessionList.length > 0) {
        const session = sessionList[0];

        const questions = await db
          .select()
          .from(AdaptiveQuestion)
          .where(eq(AdaptiveQuestion.sessionId, sessionId))
          .orderBy(asc(AdaptiveQuestion.questionIndex));

        return NextResponse.json({
          session,
          questions
        });
      }
    } catch (_) {}

    // Fallback if not found in db
    return NextResponse.json({
      session: {
        sessionId,
        status: "in_progress",
        targetRole: "Software Engineer",
        interviewType: "Technical",
        currentDifficulty: "Intermediate",
        totalQuestions: 5
      },
      questions: []
    });
  } catch (error) {
    console.error("[GET /api/interviews/adaptive/[sessionId]]", error);
    return NextResponse.json({ error: "Failed to load session details" }, { status: 500 });
  }
}
