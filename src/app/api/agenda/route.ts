import { NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";
import { AGENDA_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { topic, attendees, duration, goals } = await req.json();

    if (!topic || !duration || !goals) {
      return NextResponse.json(
        { error: "Topic, duration, and goals are required fields." },
        { status: 400 }
      );
    }

    const userPrompt = `
Topic: ${topic}
Attendees: ${attendees || "Not specified"}
Duration: ${duration} minutes
Goals/Objectives: ${goals}
    `;

    const result = await askClaude(AGENDA_PROMPT, userPrompt);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Agenda API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate agenda." },
      { status: 500 }
    );
  }
}
