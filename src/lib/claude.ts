import Anthropic from "@anthropic-ai/sdk";
import {
  generateAgendaFallback,
  generateCampaignFallback,
  generateSummaryFallback,
} from "./fallbackGenerator";

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

  // 3. Dynamic local synthesis fallback when no external LLM API keys are configured
  console.info("No active LLM API keys found. Using local synthesis fallback.");

  await new Promise((resolve) => setTimeout(resolve, 600));

  if (systemPrompt.includes("communications specialist")) {
    return generateCampaignFallback(userPrompt);
  }

  if (systemPrompt.includes("meeting facilitator")) {
    return generateAgendaFallback(userPrompt);
  }

  return generateSummaryFallback(userPrompt);
}
