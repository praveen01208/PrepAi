import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { createChatSession } from "@/utils/GeminiAIModal";
import { rateLimit } from "@/utils/rateLimit";
import { v4 as uuidv4 } from "uuid";

// POST /api/interviews — generate questions via Gemini and save interview
export async function POST(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 new interviews per minute per user
    const rl = rateLimit(`create-interview:${userId}`, { limit: 5, windowMs: 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before creating another interview." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { jobPosition, jobDesc, jobExperience } = body;

    // Validate
    if (!jobPosition?.trim() || !jobDesc?.trim() || !jobExperience?.trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const expNum = parseInt(jobExperience);
    if (isNaN(expNum) || expNum < 0 || expNum > 50) {
      return NextResponse.json(
        { error: "Years of experience must be between 0 and 50" },
        { status: 400 }
      );
    }

    // Sanitize
    const sanitize = (str) =>
      str.replace(/[<>{}]/g, "").trim().substring(0, 500);
    const position = sanitize(jobPosition);
    const description = sanitize(jobDesc);
    const experience = sanitize(jobExperience);

    // Generate questions with Gemini
    const prompt = `Generate 5 interview questions and answers for:
Job Position: ${position}
Job Description: ${description}
Years of Experience: ${experience}

Please provide a valid JSON array with this exact format:
[
  {
    "Question": "Your interview question here?",
    "Answer": "Your detailed answer here."
  }
]

Keep questions professional and relevant to the job requirements.`;

    let parsedQuestions = null;
    let cleanedResponse = "";

    try {
      const session = createChatSession();
      const aiResult = await session.sendMessage(prompt);
      let responseText = aiResult.response.text();

      cleanedResponse = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .replace(/^\s*[\r\n]/gm, "")
        .trim();

      const parsed = JSON.parse(cleanedResponse);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].Question && parsed[0].Answer) {
        parsedQuestions = parsed;
      }
    } catch (aiErr) {
      console.warn("[POST /api/interviews] AI synthesis fallback activated:", aiErr.message);
    }

    // High-yield fallback questions if AI model response had formatting hiccups
    if (!parsedQuestions) {
      parsedQuestions = [
        {
          Question: `For a ${position} role (${experience} yrs exp), explain your architectural approach to building and scaling a production application with ${description.substring(0, 100)}...`,
          Answer: `Key aspects include modular component/service hierarchy, separation of concerns, robust error handling, caching strategies, and performance telemetry.`
        },
        {
          Question: `How do you diagnose and resolve performance bottlenecks, memory leaks, and high latency in your target tech stack?`,
          Answer: `Use performance profilers, analyze CPU/heap memory snapshots, optimize DB queries with indexing, implement connection pooling, and leverage CDN/caching layers.`
        },
        {
          Question: `Explain how you handle state synchronization, race conditions, and error recovery across asynchronous workflows and API endpoints.`,
          Answer: `Implement idempotency keys, atomic database transactions, optimistic locking, token-bucket rate limiting, and structured retry policies with exponential backoff.`
        },
        {
          Question: `Design a scalable data caching and invalidation strategy for high-throughput reads vs heavy writes.`,
          Answer: `Use Cache-Aside or Write-Through with Redis, set TTLs, use Redis Pub/Sub for cache invalidation events, and handle cache stampede with distributed mutexes.`
        },
        {
          Question: `Describe a challenging production incident or bug you debugged in ${description.substring(0, 80)} and how you prevented its recurrence.`,
          Answer: `Structure using the STAR framework: Situation, Task, Action (root-cause analysis via logs/APM metrics, hotfix), and Result (added regression tests, CI/CD health checks, and alerting).`
        }
      ];
      cleanedResponse = JSON.stringify(parsedQuestions);
    }

    // Save to DB
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "candidate@prep-ai.com";
    const mockId = uuidv4();
    const createdAt = new Date().toISOString().split("T")[0];

    await db.insert(MockInterview).values({
      mockId,
      jsonMockResp: cleanedResponse,
      jobPosition: position,
      jobDesc: description,
      jobExperience: experience,
      createdBy: userEmail,
      createdAt,
    });

    return NextResponse.json({ mockId }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/interviews]", error);
    return NextResponse.json(
      { error: "Failed to create interview. Please try again." },
      { status: 500 }
    );
  }
}
