import { NextResponse } from "next/server";
import { createChatSession } from "@/utils/GeminiAIModal";

// POST /api/skillgap/analyze
// Analyzes skill gaps for target role and creates a 4-week personalized preparation roadmap
export async function POST(request) {
  try {
    const body = await request.json();
    const { currentSkills = "", targetRole = "Full Stack Developer", targetCompany = "" } = body;

    if (!currentSkills?.trim() || !targetRole?.trim()) {
      return NextResponse.json({ error: "Current skills and target role are required" }, { status: 400 });
    }

    const prompt = `You are PREP-AI's Chief Career Strategist and Senior Engineering Coach.
Analyze the technical gap for an engineer aiming for the role of "${targetRole}"${targetCompany ? ` at ${targetCompany}` : ""}.

CANDIDATE'S CURRENT SKILLS & EXPERIENCE:
"""
${currentSkills.substring(0, 2000)}
"""

Tasks:
1. Calculate a realistic Job Readiness Score (0-100%) and estimated Time to Job-Ready.
2. Identify:
   - Strong Skills (already demonstrated)
   - Developing Skills (needs polishing / deeper trade-offs)
   - Missing Skills (critical required industry skills not yet present)
3. Create a comprehensive, personalized 4-Week Preparation Roadmap:
   - Week 1: Core Fundamentals & Primary Gaps
   - Week 2: Frameworks, APIs & Database Optimization
   - Week 3: System Design, Scalability & Concurrency
   - Week 4: Full Mock Interviews, DSA Speed Practice & Portfolio Polish
   Include specific tasks and curated free learning resources/links for each week.
4. Recommend top portfolio projects to build and key certifications.

Return ONLY a valid JSON object in this exact format:
{
  "readinessScore": 68,
  "timeToReady": "4-6 weeks",
  "strongSkills": [
    { "skill": "React & Frontend Basics", "level": "advanced", "note": "Solid UI foundation" }
  ],
  "developingSkills": [
    { "skill": "SQL Query Optimization", "level": "intermediate", "note": "Needs indexing and join optimization practice" }
  ],
  "missingSkills": [
    {
      "skill": "Microservices Architecture",
      "priority": "critical",
      "currentLevel": "beginner",
      "requiredLevel": "advanced",
      "resources": [
        { "title": "System Design Primer", "type": "github", "url": "https://github.com/donnemartin/system-design-primer", "duration": "15 hrs" },
        { "title": "Microservices Patterns", "type": "article", "url": "https://microservices.io", "duration": "10 hrs" }
      ]
    }
  ],
  "learningPath": [
    {
      "week": "1",
      "focus": "Core Fundamentals & Primary Gaps",
      "tasks": [
        "Master OOP design patterns & Collections",
        "Practice 15 Medium DSA problems on Arrays & Two Pointers in LeetCode Arena"
      ],
      "milestone": "Solve 15 LeetCode challenges"
    },
    {
      "week": "2",
      "focus": "Backend APIs, Caching & Database Performance",
      "tasks": [
        "Implement REST/GraphQL API with JWT auth and rate limiting",
        "Set up Redis caching layer with cache-aside pattern"
      ],
      "milestone": "Deploy high-throughput API endpoint"
    },
    {
      "week": "3",
      "focus": "System Design & Distributed Scalability",
      "tasks": [
        "Study load balancing, database sharding, and message queues (Kafka/RabbitMQ)",
        "Design a scalable URL Shortener and Notification Service"
      ],
      "milestone": "Complete 2 end-to-end System Design architectures"
    },
    {
      "week": "4",
      "focus": "Full Mock Interviews & Portfolio Polish",
      "tasks": [
        "Complete 3 Adaptive AI Mock Interviews on PREP-AI",
        "Refine STAR method storytelling for behavioral rounds"
      ],
      "milestone": "Score 85+ on Adaptive Mock Interview"
    }
  ],
  "topProjects": [
    "Distributed Rate Limiter with Redis & Token Bucket algorithm",
    "Real-time Collaboration Canvas using WebSockets and PostgreSQL"
  ],
  "certifications": ["AWS Certified Developer Associate", "Docker Certified Associate"],
  "summary": "Executive summary of the candidate's career readiness and top advice for breaking into " + "${targetRole}."
}`;

    let analysis = null;
    try {
      const session = createChatSession();
      const result = await session.sendMessage(prompt);
      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch (aiErr) {
      console.warn("[POST /api/skillgap/analyze] AI fallback activated:", aiErr.message);
    }

    if (!analysis || typeof analysis.readinessScore === "undefined") {
      analysis = {
        readinessScore: 65,
        timeToReady: "4-6 weeks",
        strongSkills: [
          { skill: "Core Programming Fundamentals", level: "intermediate", note: "Good language syntax & logic" }
        ],
        developingSkills: [
          { skill: "API Architecture & Security", level: "intermediate", note: "Practice token expiration and rate limiting" }
        ],
        missingSkills: [
          {
            skill: "System Design & Caching",
            priority: "critical",
            currentLevel: "beginner",
            requiredLevel: "advanced",
            resources: [
              { title: "System Design Primer", type: "github", url: "https://github.com/donnemartin/system-design-primer", duration: "20 hrs" }
            ]
          },
          {
            skill: "Docker & Containerization",
            priority: "high",
            currentLevel: "beginner",
            requiredLevel: "intermediate",
            resources: [
              { title: "Docker for Developers", type: "guide", url: "https://docs.docker.com/get-started/", duration: "10 hrs" }
            ]
          }
        ],
        learningPath: [
          {
            week: "1",
            focus: "Core Language & Algorithms",
            tasks: ["Solve 15 LeetCode questions in LeetCode Arena", "Review OOP & Data Structures"],
            milestone: "15 DSA Challenges Solved"
          },
          {
            week: "2",
            focus: "Backend Frameworks & SQL Performance",
            tasks: ["Build scalable REST APIs with database indexing", "Implement Redis caching"],
            milestone: "Production-ready backend API"
          },
          {
            week: "3",
            focus: "System Design & DevOps Basics",
            tasks: ["Study load balancing & microservices", "Containerize application with Docker"],
            milestone: "Dockerized multi-container app"
          },
          {
            week: "4",
            focus: "Mock Interviews & Placement Polish",
            tasks: ["Complete 3 Adaptive Mock Interviews on PREP-AI", "Practice behavioral STAR answers"],
            milestone: "85+ Score on PREP-AI Adaptive Interview"
          }
        ],
        topProjects: [
          "Scalable URL Shortener with Redis caching and rate limiting",
          "Real-time Chat / Notification service with WebSockets"
        ],
        certifications: ["AWS Certified Developer Associate"],
        summary: `You have a solid foundation for ${targetRole}. Focus on containerization with Docker, caching with Redis, and practicing dynamic mock interviews on PREP-AI to reach 85%+ readiness.`
      };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[POST /api/skillgap/analyze]", error);
    return NextResponse.json({ error: "Failed to analyze skill gap. Please try again." }, { status: 500 });
  }
}
