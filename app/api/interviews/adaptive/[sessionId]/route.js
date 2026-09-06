import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { AdaptiveInterview, AdaptiveQuestion, MockInterview } from "@/utils/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Helper for high-yield calibrated question based on role
function getFallbackQuestion(role = "Software Engineer", type = "Technical", diff = "Intermediate") {
  return {
    questionIndex: 0,
    questionText: `For a ${diff}-level ${role} position, explain your architectural approach to designing a scalable and fault-tolerant system. How do you handle state synchronization, latency bottlenecks, and database query optimization?`,
    category: type,
    difficultyLevel: diff,
    generatedFrom: "Initial",
    idealAnswer: "A structured answer outlining modular component hierarchy, caching (e.g. Redis), connection pooling, database indexing, rate limiting, and robust error recovery mechanisms."
  };
}

// GET /api/interviews/adaptive/[sessionId]
export async function GET(request, { params }) {
  try {
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    let session = null;
    let questions = [];

    // 1. Try fetching from AdaptiveInterview table
    try {
      const sessionList = await db
        .select()
        .from(AdaptiveInterview)
        .where(eq(AdaptiveInterview.sessionId, sessionId));

      if (sessionList && sessionList.length > 0) {
        session = sessionList[0];

        const questionsList = await db
          .select()
          .from(AdaptiveQuestion)
          .where(eq(AdaptiveQuestion.sessionId, sessionId))
          .orderBy(asc(AdaptiveQuestion.questionIndex));

        if (questionsList && questionsList.length > 0) {
          questions = questionsList;
        }
      }
    } catch (dbErr) {
      console.warn("[GET /api/interviews/adaptive/[sessionId]] DB adaptive lookup:", dbErr.message);
    }

    // 2. If not found in AdaptiveInterview, check MockInterview table (legacy fallback)
    if (!session) {
      try {
        const legacyList = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, sessionId));

        if (legacyList && legacyList.length > 0) {
          const leg = legacyList[0];
          session = {
            sessionId: leg.mockId,
            targetRole: leg.jobPosition,
            experienceLevel: leg.jobExperience,
            interviewType: "Technical",
            currentDifficulty: "Intermediate",
            initialDifficulty: "Intermediate",
            totalQuestions: 5,
            status: "in_progress",
            createdAt: leg.createdAt
          };

          try {
            const parsed = JSON.parse(leg.jsonMockResp);
            if (Array.isArray(parsed)) {
              questions = parsed.map((p, idx) => ({
                questionIndex: idx,
                questionText: p.Question || p.questionText,
                category: "Technical",
                difficultyLevel: "Intermediate",
                generatedFrom: "Initial",
                idealAnswer: p.Answer || p.idealAnswer
              }));
            }
          } catch (_) {}
        }
      } catch (_) {}
    }

    // 3. If session still not found, create a sensible default
    if (!session) {
      session = {
        sessionId,
        status: "in_progress",
        targetRole: "Software Engineer",
        interviewType: "Technical",
        currentDifficulty: "Intermediate",
        initialDifficulty: "Intermediate",
        totalQuestions: 5
      };
    }

    // 4. Ensure questions array is NEVER empty
    if (!questions || questions.length === 0) {
      questions = [
        getFallbackQuestion(session.targetRole, session.interviewType, session.currentDifficulty || "Intermediate")
      ];
    }

    return NextResponse.json({
      session,
      questions
    });
  } catch (error) {
    console.error("[GET /api/interviews/adaptive/[sessionId]]", error);
    return NextResponse.json({
      session: {
        sessionId: params.sessionId,
        targetRole: "Software Engineer",
        interviewType: "Technical",
        currentDifficulty: "Intermediate",
        totalQuestions: 5,
        status: "in_progress"
      },
      questions: [getFallbackQuestion()]
    });
  }
}
