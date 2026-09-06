import { NextResponse } from "next/server";
import { createChatSession } from "@/utils/GeminiAIModal";

export async function POST(request) {
  try {
    const body = await request.json();
    const { currentSkills, targetRole, targetCompany } = body;

    if (!currentSkills?.trim() || !targetRole?.trim()) {
      return NextResponse.json({ error: "Current skills and target role are required" }, { status: 400 });
    }

    const prompt = `You are an expert Technical Career Coach and Skill Gap Analyst for PREP-AI with deep knowledge of tech industry hiring requirements.

Analyze the skill gap for this engineer:
- Current Skills: ${currentSkills.substring(0, 1000)}
- Target Role: ${targetRole}
${targetCompany ? `- Target Company: ${targetCompany}` : ""}

Return ONLY a valid JSON object with this exact structure:
{
  "readinessScore": 62,
  "timeToReady": "3-4 months",
  "gaps": [
    {
      "skill": "System Design",
      "currentLevel": "beginner",
      "requiredLevel": "advanced",
      "priority": "critical",
      "resources": [
        { "title": "Grokking the System Design Interview", "type": "course", "url": "https://www.educative.io/courses/grokking-the-system-design-interview", "duration": "40 hours" },
        { "title": "System Design Primer", "type": "github", "url": "https://github.com/donnemartin/system-design-primer", "duration": "20 hours" }
      ]
    }
  ],
  "strengths": [
    { "skill": "React", "level": "advanced", "note": "Strong foundation, keep updated" }
  ],
  "learningPath": [
    { "week": "1-2", "focus": "System Design Basics", "tasks": ["Read System Design Primer", "Watch Gaurav Sen videos"] },
    { "week": "3-4", "focus": "DSA Patterns", "tasks": ["Complete 30 LeetCode medium problems", "Focus on Trees and Graphs"] }
  ],
  "certifications": ["AWS Solutions Architect", "Google Cloud Professional"],
  "topProjects": ["Build a URL shortener with rate limiting", "Create a distributed cache"],
  "summary": "2-3 sentences summarizing the skill gap and recommended focus areas"
}`;

    const session = createChatSession();
    const result = await session.sendMessage(prompt);
    const responseText = result.response.text();
    const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(cleaned);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[POST /api/skillgap/analyze]", error);
    return NextResponse.json({ error: "Failed to analyze skill gap. Please try again." }, { status: 500 });
  }
}
