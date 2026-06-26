import { NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";
import { CAMPAIGN_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { goal, audience, tone, keyPoints } = await req.json();

    if (!goal || !audience || !tone) {
      return NextResponse.json(
        { error: "Goal, audience, and tone are required fields." },
        { status: 400 }
      );
    }

    const userPrompt = `
Goal: ${goal}
Audience: ${audience}
Tone: ${tone}
Key points: ${keyPoints || "None specified"}
    `;

    const result = await askClaude(CAMPAIGN_PROMPT, userPrompt);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Campaign API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate message." },
      { status: 500 }
    );
  }
}
