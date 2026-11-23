/**
 * Dynamic local synthesis engine used when no external LLM API key is configured.
 * Generates tailored, professional outputs directly from the user's inputs.
 */

function extractField(prompt: string, label: string): string {
  const regex = new RegExp(`^${label}:\\s*(.+)$`, "im");
  const match = prompt.match(regex);
  return match ? match[1].trim() : "";
}

function extractTrailingField(prompt: string, label: string): string {
  const regex = new RegExp(`^${label}:\\s*([\\s\\S]+)$`, "im");
  const match = prompt.match(regex);
  return match ? match[1].trim() : "";
}

function splitList(raw: string): string[] {
  if (!raw || raw.toLowerCase() === "none specified" || raw.toLowerCase() === "not specified") {
    return [];
  }
  return raw
    .split(/\r?\n|[;•]+|,\s+(?=[A-Z0-9])/)
    .map((item) => item.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function formatTime(totalMinutes: number): string {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function generateCampaignFallback(userPrompt: string): string {
  const goal = extractField(userPrompt, "Goal") || "Important Team Update";
  const audience = extractField(userPrompt, "Audience") || "Team";
  const tone = extractField(userPrompt, "Tone") || "Professional";
  const keyPointsRaw = extractTrailingField(userPrompt, "Key points");
  const keyPoints = splitList(keyPointsRaw);

  const toneLower = tone.toLowerCase();

  let greeting = `Hi ${audience},`;
  let opener = `I'm writing to share an important update regarding **${goal}**.`;
  let closing = `Please review these details and let us know if you have any questions or feedback.`;
  let signOff = `Best regards,\nInternal Communications`;

  if (toneLower.includes("upbeat") || toneLower.includes("inspir")) {
    greeting = `Hi ${audience},`;
    opener = `We're thrilled to share an exciting milestone with you: **${goal}**! Thank you for all the energy and collaboration that brought us here.`;
    closing = `Let's keep this momentum going—reach out if you have ideas or want to get involved!`;
    signOff = `Warmly,\nInternal Communications`;
  } else if (toneLower.includes("urgent") || toneLower.includes("action")) {
    greeting = `${audience},`;
    opener = `**Action Required:** Please review the following update regarding **${goal}**. Your timely attention helps keep our deliverables on track.`;
    closing = `Please prioritize the items above and confirm once your next steps are underway.`;
    signOff = `Thank you,\nProject Leadership`;
  } else if (toneLower.includes("formal") || toneLower.includes("executive")) {
    greeting = `Dear ${audience},`;
    opener = `Please find below a formal briefing on **${goal}**, outlining our strategic focus and immediate priorities.`;
    closing = `Should you require additional context or wish to discuss next steps, please reach out directly.`;
    signOff = `Sincerely,\nLeadership & Communications`;
  } else if (toneLower.includes("casual") || toneLower.includes("friendly") || toneLower.includes("warm")) {
    greeting = `Hey ${audience},`;
    opener = `Quick update to keep everyone in the loop on **${goal}**.`;
    closing = `Feel free to drop any questions in the thread or ping us directly!`;
    signOff = `Cheers,\nThe Team`;
  }

  const subjectPrefix = toneLower.includes("urgent") ? "[Action Required] " : "";
  const subject = `Subject: ${subjectPrefix}${goal}`;

  const highlightsSection =
    keyPoints.length > 0
      ? `\nKey Details:\n${keyPoints.map((pt) => `• ${pt}`).join("\n")}\n`
      : `\nNext Steps:\n• Align on priorities and timeline for ${goal}.\n• Share any blockers or questions with the project leads.\n`;

  return `${subject}

${greeting}

${opener}
${highlightsSection}
${closing}

${signOff}`;
}

export function generateAgendaFallback(userPrompt: string): string {
  const topic = extractField(userPrompt, "Topic") || "Team Alignment Session";
  const attendeesRaw = extractField(userPrompt, "Attendees");
  const durationRaw = extractField(userPrompt, "Duration").replace(/[^0-9]/g, "");
  const goalsRaw = extractTrailingField(userPrompt, "Goals/Objectives");

  const totalMinutes = Math.max(15, parseInt(durationRaw, 10) || 30);
  const attendees = splitList(attendeesRaw);
  const goals = splitList(goalsRaw);

  const attendeeDisplay = attendees.length > 0 ? attendees.join(", ") : "All invited stakeholders";
  const discussionTopics =
    goals.length > 0
      ? goals
      : [`Core discussion & alignment on ${topic}`, "Risks, dependencies & resource needs"];

  // Allocate time blocks that sum up cleanly to totalMinutes
  const openMins = totalMinutes >= 45 ? 5 : Math.max(3, Math.round(totalMinutes * 0.15));
  const closeMins = totalMinutes >= 45 ? 5 : Math.max(3, Math.round(totalMinutes * 0.15));
  const remainingMins = Math.max(5, totalMinutes - openMins - closeMins);

  const perTopicBase = Math.floor(remainingMins / discussionTopics.length);
  const remainder = remainingMins % discussionTopics.length;

  const blocks: Array<{ start: number; duration: number; title: string; lead: string; goal: string }> = [];
  let cursor = 0;

  blocks.push({
    start: cursor,
    duration: openMins,
    title: "Welcome & Context Setting",
    lead: attendees[0] || "Meeting Facilitator",
    goal: `Establish the objective for ${topic} and confirm desired outcomes.`,
  });
  cursor += openMins;

  discussionTopics.forEach((item, index) => {
    const blockDur = perTopicBase + (index < remainder ? 1 : 0);
    const lead = attendees.length > 0 ? attendees[index % attendees.length] : "Topic Lead";
    blocks.push({
      start: cursor,
      duration: blockDur,
      title: item,
      lead,
      goal: `Discuss ${item.toLowerCase()} and align on concrete decisions.`,
    });
    cursor += blockDur;
  });

  blocks.push({
    start: cursor,
    duration: closeMins,
    title: "Action Items & Next Steps",
    lead: attendees[0] || "All Attendees",
    goal: "Confirm owners, deadlines, and follow-up cadence.",
  });

  const blocksMarkdown = blocks
    .map(
      (b) =>
        `* **${formatTime(b.start)} - ${formatTime(b.start + b.duration)} (${b.duration}m) | ${b.title}**\n  * *Lead:* ${b.lead}\n  * *Objective:* ${b.goal}`
    )
    .join("\n");

  return `# Meeting Agenda: ${topic}
**Objective:** ${goals.length > 0 ? goals.join("; ") : `Align on ${topic} and confirm next steps.`}

## Details
* **Duration:** ${totalMinutes} minutes
* **Attendees:** ${attendeeDisplay}

## Time Blocks
${blocksMarkdown}`;
}

export function generateSummaryFallback(userPrompt: string): string {
  const rawSection = userPrompt
    .trim()
    .replace(/^Raw Meeting Notes\/Bullets:\s*/i, "")
    .trim();
  const lines = rawSection
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return `## Summary
No meeting notes were provided to summarize.

## Action Items
* Add bullet points or transcript notes above to extract assigned tasks and deadlines.`;
  }

  const actionPattern = /\b(action|todo|to-do|follow[- ]?up|will|needs? to|should|must|assign(?:ed)?|owner|due|by\s+(?:mon|tue|wed|thu|fri|sat|sun|next|eod|eow|tomorrow)|@\w+)\b/i;
  const decisionPattern = /\b(decided|agreed|approved|confirmed|finalized|resolved|greenlit|signed off)\b/i;

  const actionItems: string[] = [];
  const decisions: string[] = [];
  const contextPoints: string[] = [];

  for (const line of lines) {
    if (actionPattern.test(line)) {
      actionItems.push(line);
    } else if (decisionPattern.test(line)) {
      decisions.push(line);
    } else {
      contextPoints.push(line);
    }
  }

  const summarySentences: string[] = [];
  if (contextPoints.length > 0) {
    const joined = contextPoints
      .slice(0, 4)
      .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`))
      .join(" ");
    summarySentences.push(joined);
  }
  if (decisions.length > 0) {
    summarySentences.push(
      `Key decisions were reached regarding ${decisions.length === 1 ? decisions[0].replace(/[.!?]+$/, "") : `${decisions.length} core items`}.`
    );
  }
  if (summarySentences.length === 0) {
    summarySentences.push(
      `The meeting focused on reviewing ${lines.length} key items and aligning on immediate next steps.`
    );
  }

  const decisionsSection =
    decisions.length > 0
      ? `\n## Key Decisions\n${decisions.map((d) => `* ${d}`).join("\n")}\n`
      : "";

  const actionSection =
    actionItems.length > 0
      ? actionItems.map((item) => `* ${item}`).join("\n")
      : `* Review the discussion points above and assign owners/deadlines as needed.`;

  return `## Summary
${summarySentences.join(" ")}
${decisionsSection}
## Action Items
${actionSection}`;
}
