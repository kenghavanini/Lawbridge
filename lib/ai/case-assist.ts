import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { practiceAreaEnum } from "@/lib/validations/case";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const caseAssistSchema = z.object({
  polishedSummary: z.string().min(20).max(600),
  suggestedPracticeArea: practiceAreaEnum,
  suggestedJurisdictionHint: z.string(),
  notes: z.array(z.string()).max(3),
});

export type CaseAssistResult = z.infer<typeof caseAssistSchema>;

export class CaseAssistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CaseAssistError";
  }
}

const SYSTEM_PROMPT = `You are a legal-intake writing assistant for a lawyer-matching marketplace. You do not give legal advice or draw conclusions about the merits of anyone's situation.

Given a client's rough, informal description of their legal situation, return JSON with exactly these fields:

- polishedSummary: a rewritten, professional version safe for PUBLIC display to browsing lawyers. This must NEVER include names, company names, exact street addresses, exact dates, or any other detail that could identify the client or another party — generalize specifics ("last month" not "March 3rd", "a former employer" not the company's name). 2-4 sentences, neutral and factual.
- suggestedPracticeArea: your best-guess practice area, one of: ${practiceAreaEnum.options.join(", ")}.
- suggestedJurisdictionHint: a city, region, or country name if inferable from the text, otherwise an empty string — do not guess if nothing suggests a location.
- notes: up to 3 short (under 20 words each), constructive notes about vague phrasing, pointing toward clearer or more standard terminology. Empty array if the writing is already clear.

Return ONLY the JSON object — no markdown fencing, no preamble.`;

export async function analyzeIntakeDraft(rawText: string): Promise<CaseAssistResult> {
  const trimmed = rawText.trim();
  if (trimmed.length < 20) {
    throw new CaseAssistError("Write a bit more before running the AI assistant.");
  }

  let response: Anthropic.Message;
  try {
    response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: trimmed }],
    });
  } catch (error) {
    throw new CaseAssistError(`AI assistant request failed: ${error instanceof Error ? error.message : "unknown error"}`);
  }

  const textBlock = response.content.find((block): block is Anthropic.TextBlock => block.type === "text");
  if (!textBlock) {
    throw new CaseAssistError("The assistant returned no content.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(textBlock.text);
  } catch {
    throw new CaseAssistError("The assistant returned malformed output.");
  }

  const result = caseAssistSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new CaseAssistError("The assistant's output didn't match the expected format.");
  }

  return result.data;
}
