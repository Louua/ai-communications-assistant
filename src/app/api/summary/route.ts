import { NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";
import { SUMMARY_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    if (!notes) {
      return NextResponse.json(
        { error: "Meeting notes/bullets are required." },
        { status: 400 }
      );
    }

    const userPrompt = `
Raw Meeting Notes/Bullets:
${notes}
    `;

    const result = await askClaude(SUMMARY_PROMPT, userPrompt);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Summary API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate summary." },
      { status: 500 }
    );
  }
}
