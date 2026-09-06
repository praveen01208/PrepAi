import { NextResponse } from "next/server";
import { createChatSession } from "@/utils/GeminiAIModal";

export async function POST(request) {
  try {
    const body = await request.json();
    const { resumeText, targetRole } = body;

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 });
    }

    const prompt = `You are an expert Resume Analyst and Career Coach for PREP-AI with 15+ years of FAANG, top startup, and campus recruitment experience.

Analyze the following resume${targetRole ? ` for a "${targetRole}" position` : ""}:

RESUME TEXT:
${resumeText.substring(0, 4000)}

Provide a comprehensive analysis. Return ONLY a valid JSON object with this exact structure:
{
  "overallScore": 78,
  "atsScore": 72,
  "impactScore": 65,
  "sections": {
    "contact": { "score": 90, "status": "good", "feedback": "..." },
    "summary": { "score": 55, "status": "needs_work", "feedback": "..." },
    "experience": { "score": 80, "status": "good", "feedback": "..." },
    "skills": { "score": 70, "status": "average", "feedback": "..." },
    "education": { "score": 85, "status": "good", "feedback": "..." },
    "projects": { "score": 60, "status": "needs_work", "feedback": "..." }
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": [
    { "priority": "high", "issue": "...", "suggestion": "..." },
    { "priority": "medium", "issue": "...", "suggestion": "..." },
    { "priority": "low", "issue": "...", "suggestion": "..." }
  ],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "actionVerbs": { "found": ["built", "designed"], "missing": ["optimized", "scaled", "architected"] },
  "quantificationTips": ["Add metrics to achievement 1", "Quantify impact in experience section"],
  "summary": "2-3 sentence executive summary of the resume quality and top recommendation"
}`;

    const session = createChatSession();
    const result = await session.sendMessage(prompt);
    const responseText = result.response.text();
    const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(cleaned);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[POST /api/resume/analyze]", error);
    return NextResponse.json({ error: "Failed to analyze resume. Please try again." }, { status: 500 });
  }
}
