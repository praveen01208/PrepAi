import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const maxDuration = 60;

// POST /api/resume/parse — Extracts plain text from uploaded PDF, DOCX, or TXT resumes
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name || "resume.pdf";
    const lowerName = fileName.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (lowerName.endsWith(".pdf")) {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      extractedText = result?.text || "";
      // Remove page division markers like "-- 1 of 2 --"
      extractedText = extractedText.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, "").trim();
    } else if (lowerName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result?.value || "";
    } else if (lowerName.endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    extractedText = extractedText.trim();

    if (!extractedText || extractedText.length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract readable text from this document. It may be a scanned image or protected. Please copy and paste your resume text directly into the box.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      fileName,
      text: extractedText,
      charCount: extractedText.length,
      wordCount: extractedText.split(/\s+/).filter(Boolean).length,
    });
  } catch (error) {
    console.error("[POST /api/resume/parse]", error);
    return NextResponse.json(
      {
        error:
          "Failed to parse document. Please check the file or copy and paste the resume text directly.",
      },
      { status: 500 }
    );
  }
}
