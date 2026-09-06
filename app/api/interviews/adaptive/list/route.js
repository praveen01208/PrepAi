import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { AdaptiveInterview } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/interviews/adaptive/list
export async function GET() {
  try {
    let userEmail = "candidate@prep-ai.com";
    try {
      const user = await currentUser();
      if (user?.primaryEmailAddress?.emailAddress) {
        userEmail = user.primaryEmailAddress.emailAddress;
      }
    } catch (_) {}

    const interviews = await db
      .select()
      .from(AdaptiveInterview)
      .where(eq(AdaptiveInterview.userEmail, userEmail))
      .orderBy(desc(AdaptiveInterview.createdAt));

    return NextResponse.json(interviews || []);
  } catch (error) {
    // Return empty list if table doesn't exist yet or query fails
    return NextResponse.json([]);
  }
}
