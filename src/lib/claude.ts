import Anthropic from "@anthropic-ai/sdk";

export async function askClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. Try Anthropic Claude if key is configured (and not the placeholder)
  if (anthropicApiKey && anthropicApiKey !== "your_anthropic_api_key_here" && !anthropicApiKey.startsWith("sk-ant-xxx")) {
    try {
      const anthropic = new Anthropic({
        apiKey: anthropicApiKey,
      });

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      return textBlock && 'text' in textBlock ? textBlock.text : "";
    } catch (error: any) {
      console.error("Anthropic API Error:", error);
      throw new Error(`Anthropic API call failed: ${error.message || error}`);
    }
  }

  // 2. Try Gemini fallback if key is configured (and not the placeholder)
  if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here") {
    try {
      const model = "gemini-2.5-flash";
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${systemPrompt}\n\nUser Request:\n${userPrompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Invalid response format from Gemini API");
      }
      return text;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw new Error(`Gemini API call failed: ${error.message || error}`);
    }
  }

  // 3. Fallback Mock response for local development when keys are not configured
  console.warn("No active LLM API keys found. Returning mock response.");
  
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate latency

  if (systemPrompt.includes("communications specialist")) {
    return `[MOCK - Add ANTHROPIC_API_KEY or GEMINI_API_KEY in .env.local to generate real messages]

Subject: Launching our New Initiative: Let's Achieve Greatness Together!

Dear Team,

We are excited to share the upcoming plans for our new campaign. Over the next few weeks, we will be focusing on improving our internal alignment and customer outreach.

Key Highlights:
• Clear timelines and deliverables for each department.
• Focus on user-centric updates.
• Feedback loops to hear directly from our team.

Let's make this campaign a massive success! If you have any questions, feel free to reach out to the project leads.

Best regards,
Internal Communications Team`;
  }

  if (systemPrompt.includes("meeting facilitator")) {
    return `[MOCK - Add ANTHROPIC_API_KEY or GEMINI_API_KEY in .env.local to generate real agendas]

# Meeting Agenda: Project Kickoff & Goal Setting
**Objective:** Align on scope, roles, and project timeline.

## Details
* **Duration:** 60 minutes
* **Attendees:** Engineering, Design, Product, and Marketing leads

## Time Blocks
* **00:00 - 00:10 (10m) | Welcome & Objective Setting**
  * *Lead:* Facilitator
  * *Goal:* Align on the core purpose of today's session.
* **00:10 - 00:30 (20m) | Project Scope & Requirements Review**
  * *Lead:* Product Management
  * *Goal:* Confirm key features, timelines, and dependencies.
* **00:30 - 00:50 (20m) | Role Assignments & Milestones**
  * *Lead:* All Leads
  * *Goal:* Agree on ownership of core tasks and delivery dates.
* **00:50 - 01:00 (10m) | Next Steps & Q&A**
  * *Lead:* All
  * *Goal:* Review action items and confirm the next sync.`;
  }

  return `[MOCK - Add ANTHROPIC_API_KEY or GEMINI_API_KEY in .env.local to generate real summaries]

## Summary
The team met to finalize the project roadmap and clear up current blockers. High-level alignment was achieved regarding user experience design, and the database schema changes were approved. 

## Action Items
* **Design Team:** Finalize high-fidelity mockups (Owner: Sarah, Due: Next Tuesday)
* **Engineering Team:** Create initial database migration script (Owner: David, Due: This Friday)
* **Product Team:** Update the product specification doc with feedback (Owner: Jordan, Due: Next Monday)`;
}
