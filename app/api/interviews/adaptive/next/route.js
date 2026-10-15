import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { AdaptiveInterview, AdaptiveQuestion, UserSkillMatrix } from "@/utils/schema";
import { createChatSession, cleanAndParseJson } from "@/utils/ClaudeAIModal";
import { eq } from "drizzle-orm";

export const maxDuration = 60;

// Common filler words regex
const FILLER_WORDS_REGEX = /\b(um|uh|er|ah|like|basically|actually|you know|literally|sort of|kind of|i mean|honestly|right)\b/gi;

export async function POST(request) {
  try {
    let userId = "guest_user";
    try {
      const authResult = await auth();
      if (authResult?.userId) userId = authResult.userId;
    } catch (_) {}

    const body = await request.json();
    const {
      sessionId,
      questionIndex = 0,
      questionText = "",
      idealAnswer = "",
      userResponse = "",
      userResponseMode = "text",
      currentDifficulty = "Intermediate",
      targetRole = "Software Engineer",
      interviewType = "Technical",
      totalQuestions = 5,
      resumeContext = "",
      history = [],
      durationSeconds = 60
    } = body;

    if (!userResponse || !userResponse.trim()) {
      return NextResponse.json({ error: "Candidate response is required" }, { status: 400 });
    }

    // 1. Client & Server Filler Word Analysis
    const matches = userResponse.match(FILLER_WORDS_REGEX) || [];
    const fillerWordMap = {};
    matches.forEach(w => {
      const lower = w.toLowerCase();
      fillerWordMap[lower] = (fillerWordMap[lower] || 0) + 1;
    });
    const totalFillerCount = matches.length;

    // Calculate approximate speaking pace (WPM)
    const wordCount = userResponse.trim().split(/\s+/).length;
    const durationMin = Math.max((durationSeconds || 45) / 60, 0.25);
    const calculatedWpm = Math.round(wordCount / durationMin);

    let paceVerdict = "Good Pace";
    if (calculatedWpm < 100) paceVerdict = "Slightly Slow";
    else if (calculatedWpm > 180) paceVerdict = "Too Fast";

    // 2. Multi-dimensional AI Evaluation & Adaptive Decision Prompt
    const nextQIndex = questionIndex + 1;
    const isFinalQuestion = nextQIndex >= totalQuestions;

    const evaluationPrompt = `You are PREP-AI, an expert Principal Interviewer, Hiring Manager, and Communication Coach.
Evaluate the candidate's answer and determine the next adaptive action.

Configuration:
- Target Role: ${targetRole}
- Interview Type: ${interviewType}
- Current Question #${questionIndex + 1} (Difficulty: ${currentDifficulty}):
"${questionText}"

Ideal / Reference Points:
"${idealAnswer}"

Candidate's Submission (Mode: ${userResponseMode.toUpperCase()}):
"""
${userResponse.substring(0, 3000)}
"""

Session History Summary:
${history.slice(-3).map((h, i) => `Q${i + 1}: ${h.q} | Score: ${h.score || 70}`).join("\n") || "First question in session"}
${resumeContext ? `Resume Context: ${resumeContext.substring(0, 800)}` : ""}

CRITICAL SCORING & ANALYSIS RULES:
1. Compare the Candidate's Submission directly against the Current Question and Ideal / Reference Points.
2. RIGOROUS REALISTIC SCORING (DO NOT anchor to example numbers or return generic high scores):
   - Irrelevant, blank, gibberish, evasive, or "I don't know" answers MUST receive an overall score between 5 and 25.
   - Shallow or incomplete answers that barely touch the surface score between 35 and 60.
   - Clear, competent answers covering core concepts score between 70 and 85.
   - Comprehensive, expert answers with deep trade-offs, architecture, and edge cases score between 86 and 98.
3. In "feedback", "strengths", and "weaknesses", cite specific technical points from the candidate's actual words.

Adaptive Rules for Next Question:
- If Overall Score >= 80: Action is "escalate". Increase difficulty (Beginner -> Intermediate -> Advanced). Generate a deeper, advanced question or system architecture challenge building on their strength.
- If Overall Score between 60-79: Action is "follow_up" or "maintain". Keep difficulty. Generate an intelligent, context-aware follow-up question probing specific decisions or edge cases in their answer.
- If Overall Score < 60: Action is "simplify". Decrease difficulty (Advanced -> Intermediate -> Beginner). Identify their weak area and generate a helpful foundational or clarifying question so they can explain the core concepts clearly.
${isFinalQuestion ? "NOTE: This was the final question of the interview. Do not generate a next question; summarize session strengths, weaknesses, and recommended topics." : ""}

Return ONLY a valid JSON object matching this schema:
{
  "score": 75,
  "technicalScore": 78,
  "clarityScore": 72,
  "relevanceScore": 80,
  "confidenceRating": "Moderate",
  "feedback": "Specific, tailored assessment referencing candidate's actual answer.",
  "strengths": ["Specific strength 1", "Specific strength 2"],
  "weaknesses": ["Specific weakness 1", "Specific weakness 2"],
  "adaptiveAction": "escalate",
  "nextDifficulty": "${currentDifficulty === "Beginner" ? "Intermediate" : "Advanced"}",
  "nextQuestion": ${
    isFinalQuestion
      ? "null"
      : `{
    "questionText": "Your next tailored adaptive question here...",
    "category": "${interviewType}",
    "difficultyLevel": "${currentDifficulty === "Beginner" ? "Intermediate" : "Advanced"}",
    "generatedFrom": "Adaptive-Escalate",
    "idealAnswer": "Reference answer points expected for this next challenge."
  }`
  },
  "summaryReport": ${
    isFinalQuestion
      ? `{
    "overallScore": 78,
    "technicalScore": 80,
    "communicationScore": 75,
    "codingScore": 76,
    "verdict": "Candidate Evaluated",
    "strengths": ["Key strength from session"],
    "weaknesses": ["Key growth area from session"],
    "recommendedTopics": ["Topic 1", "Topic 2"],
    "nextPracticeSuggestion": "Suggested practice topic"
  }`
      : "null"
  }
}`;

    let evalResult = null;
    try {
      const session = createChatSession();
      const aiResult = await session.sendMessage(evaluationPrompt);
      const responseText = aiResult.response.text();
      evalResult = cleanAndParseJson(responseText);
    } catch (aiErr) {
      console.warn("[POST /api/interviews/adaptive/next] AI eval fallback activated:", aiErr.message);
    }

    // High quality fallback if AI parsing fails
    if (!evalResult || typeof evalResult.score === "undefined") {
      const isGibberish = wordCount < 5 || /(asdf|qwer|test|bla|xyz)/i.test(userResponse);
      const estimatedScore = isGibberish ? 15 : Math.min(Math.max(Math.round(wordCount > 40 ? 75 : 55), 25), 90);
      const isGood = estimatedScore >= 75;
      const nextDiff = isGood ? (currentDifficulty === "Beginner" ? "Intermediate" : "Advanced") : "Intermediate";

      evalResult = {
        score: estimatedScore,
        technicalScore: isGibberish ? 10 : estimatedScore,
        clarityScore: isGibberish ? 15 : estimatedScore,
        relevanceScore: isGibberish ? 10 : 70,
        confidenceRating: totalFillerCount > 4 ? "Hesitant" : "Moderate",
        feedback: isGibberish
          ? "The response did not answer the technical question asked. Please articulate a structured technical solution."
          : "Your answer touches upon the core problem. Focus on providing concrete technical terminology, algorithmic complexity, and edge case trade-offs.",
        strengths: isGibberish ? ["Submission recorded"] : ["Addresses problem context", "Clear pacing"],
        weaknesses: isGibberish ? ["Did not answer technical prompt"] : ["Explain internal mechanics", "Quantify operational impact"],
        adaptiveAction: isGood ? "escalate" : (isGibberish ? "simplify" : "follow_up"),
        nextDifficulty: nextDiff,
        nextQuestion: isFinalQuestion ? null : {
          questionText: `Building on your explanation, how would you optimize this solution for higher throughput and what potential bottlenecks would you monitor in production?`,
          category: interviewType,
          difficultyLevel: nextDiff,
          generatedFrom: isGood ? "Escalation" : "Follow-Up",
          idealAnswer: "Identify memory/CPU hotspots, propose indexing, connection pooling, caching layers, and implement structured health checks and telemetry."
        },
        summaryReport: isFinalQuestion ? {
          overallScore: estimatedScore,
          technicalScore: estimatedScore,
          communicationScore: 75,
          codingScore: 70,
          verdict: isGood ? "Candidate Recommended" : "Needs Further Practice",
          strengths: ["Domain familiarity"],
          weaknesses: ["Deepen system trade-offs"],
          recommendedTopics: ["System Design Trade-offs", "STAR Impact Quantification"],
          nextPracticeSuggestion: "Try a High-Concurrency Backend Session"
        } : null
      };
    }

    const nextDiffLevel = evalResult.nextDifficulty || currentDifficulty;
    const createdAt = new Date().toISOString();

    // 3. Persist Question & Evaluation to DB
    try {
      await db.insert(AdaptiveQuestion).values({
        sessionId,
        questionIndex,
        questionText,
        category: interviewType,
        difficultyLevel: currentDifficulty,
        generatedFrom: "Adaptive",
        idealAnswer: idealAnswer || "",
        userResponse,
        userResponseMode,
        score: String(evalResult.score),
        relevanceScore: String(evalResult.relevanceScore || 80),
        clarityScore: String(evalResult.clarityScore || 80),
        technicalDepthScore: String(evalResult.technicalScore || 80),
        fillerWordsCount: totalFillerCount,
        fillerWordsDetails: JSON.stringify(fillerWordMap),
        speakingPaceWpm: calculatedWpm,
        confidenceRating: evalResult.confidenceRating || "Moderate",
        evaluationFeedback: evalResult.feedback || "",
        adaptiveActionTaken: evalResult.adaptiveAction || "maintain",
        createdAt
      });

      // If next question exists, record it in DB
      if (evalResult.nextQuestion && !isFinalQuestion) {
        await db.insert(AdaptiveQuestion).values({
          sessionId,
          questionIndex: nextQIndex,
          questionText: evalResult.nextQuestion.questionText,
          category: evalResult.nextQuestion.category || interviewType,
          difficultyLevel: evalResult.nextQuestion.difficultyLevel || nextDiffLevel,
          generatedFrom: evalResult.nextQuestion.generatedFrom || "Adaptive",
          idealAnswer: evalResult.nextQuestion.idealAnswer || "",
          createdAt
        });
      }

      // If interview is finished, update session record with final performance stats
      if (isFinalQuestion) {
        const report = evalResult.summaryReport || {};
        await db.update(AdaptiveInterview)
          .set({
            status: "completed",
            currentDifficulty: nextDiffLevel,
            overallScore: String(report.overallScore || evalResult.score),
            technicalScore: String(report.technicalScore || evalResult.technicalScore || evalResult.score),
            communicationScore: String(report.communicationScore || evalResult.clarityScore || 80),
            codingScore: String(report.codingScore || 80),
            feedbackSummary: evalResult.feedback,
            strengths: JSON.stringify(report.strengths || evalResult.strengths || []),
            weaknesses: JSON.stringify(report.weaknesses || evalResult.weaknesses || []),
            recommendedTopics: JSON.stringify(report.recommendedTopics || []),
            completedAt: createdAt
          })
          .where(eq(AdaptiveInterview.sessionId, sessionId));
      } else {
        // Update current difficulty in session
        await db.update(AdaptiveInterview)
          .set({ currentDifficulty: nextDiffLevel })
          .where(eq(AdaptiveInterview.sessionId, sessionId));
      }
    } catch (dbErr) {
      console.warn("[POST /api/interviews/adaptive/next] DB record warning:", dbErr.message);
    }

    return NextResponse.json({
      sessionId,
      evaluatedIndex: questionIndex,
      score: evalResult.score,
      technicalScore: evalResult.technicalScore,
      clarityScore: evalResult.clarityScore,
      relevanceScore: evalResult.relevanceScore,
      confidenceRating: evalResult.confidenceRating,
      feedback: evalResult.feedback,
      strengths: evalResult.strengths,
      weaknesses: evalResult.weaknesses,
      adaptiveAction: evalResult.adaptiveAction,
      nextDifficulty: nextDiffLevel,
      fillerAnalysis: {
        totalFillers: totalFillerCount,
        breakdown: fillerWordMap,
        wpm: calculatedWpm,
        paceVerdict
      },
      isFinalQuestion,
      nextQuestion: evalResult.nextQuestion,
      summaryReport: evalResult.summaryReport
    });
  } catch (error) {
    console.error("[POST /api/interviews/adaptive/next]", error);
    return NextResponse.json({ error: "Failed to evaluate answer and adapt interview" }, { status: 500 });
  }
}
