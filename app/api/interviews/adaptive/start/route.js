import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { AdaptiveInterview, AdaptiveQuestion } from "@/utils/schema";
import { createChatSession } from "@/utils/GeminiAIModal";
import { v4 as uuidv4 } from "uuid";

// POST /api/interviews/adaptive/start
// Initializes an adaptive interview session and generates the first calibrated question.
export async function POST(request) {
  try {
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

    const body = await request.json();
    const {
      targetRole = "Software Engineer",
      experienceLevel = "2",
      interviewType = "Technical",
      initialDifficulty = "Intermediate",
      totalQuestions = 5,
      targetCompany = "",
      preferredLanguage = "javascript",
      resumeContext = ""
    } = body;

    const sessionId = uuidv4();
    const createdAt = new Date().toISOString();

    // AI Prompt to synthesize the first question calibrated to the session parameters
    const prompt = `You are PREP-AI, an expert Principal Technical Interviewer and Hiring Manager.
You are starting an Adaptive AI Mock Interview session with the following configuration:
- Target Job Role: ${targetRole}
- Experience Level: ${experienceLevel} Years
- Interview Type: ${interviewType} (HR, Technical, Coding, Behavioral, Mixed, Resume-Based, or Role-Specific)
- Starting Difficulty: ${initialDifficulty} (Beginner, Intermediate, Advanced)
${targetCompany ? `- Target Company: ${targetCompany}` : ""}
${preferredLanguage ? `- Preferred Programming Language (if coding): ${preferredLanguage}` : ""}
${resumeContext ? `- Candidate Resume Highlights & Projects:\n${resumeContext.substring(0, 1500)}` : ""}

Task: Generate Question #1 to start this interview session.
${
  resumeContext && interviewType === "Resume-Based"
    ? "IMPORTANT: Base this opening question directly on one of the projects or key technologies mentioned in the candidate's resume."
    : interviewType === "HR" || interviewType === "Behavioral"
    ? "Ask a thoughtful opening behavioral or situational question relevant to the role."
    : interviewType === "Coding"
    ? `Provide an initial algorithmic or data structure problem suited for ${initialDifficulty} difficulty in ${preferredLanguage}.`
    : `Ask an engaging ${initialDifficulty}-level technical or architectural question for a ${targetRole}.`
}

Return ONLY a valid JSON object in this exact format:
{
  "questionText": "Your opening question text here",
  "category": "${interviewType}",
  "difficultyLevel": "${initialDifficulty}",
  "generatedFrom": "${resumeContext ? "Resume" : "Initial"}",
  "idealAnswer": "Comprehensive reference answer and key points expected from a strong candidate."
}`;

    let questionData = null;
    try {
      const session = createChatSession();
      const aiResult = await session.sendMessage(prompt);
      const responseText = aiResult.response.text();
      const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      questionData = JSON.parse(cleaned);
    } catch (aiErr) {
      console.warn("[POST /api/interviews/adaptive/start] AI fallback activated:", aiErr.message);
    }

    if (!questionData || !questionData.questionText) {
      // Fallback opening question
      questionData = {
        questionText: `To start our ${initialDifficulty} ${interviewType} session for ${targetRole}, could you walk me through the core architectural components of a recent production application you built, focusing on how you handled scalability and error handling?`,
        category: interviewType,
        difficultyLevel: initialDifficulty,
        generatedFrom: "Initial",
        idealAnswer: "A structured overview covering frontend/backend separation, state management, API contracts, caching/database strategies, and resilient error recovery mechanisms."
      };
    }

    // Insert session into DB
    try {
      await db.insert(AdaptiveInterview).values({
        sessionId,
        userId,
        userEmail,
        targetRole,
        experienceLevel: String(experienceLevel),
        interviewType,
        initialDifficulty,
        currentDifficulty: initialDifficulty,
        totalQuestions: Number(totalQuestions) || 5,
        targetCompany: targetCompany || null,
        preferredLanguage: preferredLanguage || "javascript",
        resumeContext: resumeContext || null,
        status: "in_progress",
        createdAt
      });

      // Insert first question record
      await db.insert(AdaptiveQuestion).values({
        sessionId,
        questionIndex: 0,
        questionText: questionData.questionText,
        category: questionData.category || interviewType,
        difficultyLevel: questionData.difficultyLevel || initialDifficulty,
        generatedFrom: questionData.generatedFrom || "Initial",
        idealAnswer: questionData.idealAnswer || "",
        createdAt
      });
    } catch (dbErr) {
      console.warn("[POST /api/interviews/adaptive/start] DB insert warning:", dbErr.message);
    }

    return NextResponse.json({
      sessionId,
      questionIndex: 0,
      totalQuestions: Number(totalQuestions) || 5,
      currentDifficulty: initialDifficulty,
      targetRole,
      interviewType,
      question: questionData
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/interviews/adaptive/start]", error);
    return NextResponse.json({ error: "Failed to initialize adaptive interview session" }, { status: 500 });
  }
}
