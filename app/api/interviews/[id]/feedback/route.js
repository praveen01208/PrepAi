import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq, asc } from "drizzle-orm";

// GET /api/interviews/[id]/feedback — fetch all answers+feedback for an interview
export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, id))
      .orderBy(asc(UserAnswer.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/interviews/[id]/feedback]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
