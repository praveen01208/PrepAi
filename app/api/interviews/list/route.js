export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";

// GET /api/interviews/list — fetch all interviews for the currently logged-in user
export async function GET() {
  try {
    let userEmail = null;

    try {
      const { userId } = await auth();
      const user = await currentUser();
      if (userId && user) {
        userEmail = user.primaryEmailAddress?.emailAddress ?? null;
      }
    } catch (_) {}

    if (!userEmail) {
      // Return empty list for unauthenticated users instead of 401
      return NextResponse.json([]);
    }

    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/interviews/list]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
