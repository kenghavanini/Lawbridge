"use server";

import { analyzeIntakeDraft, CaseAssistError } from "@/lib/ai/case-assist";

export async function runIntakeAssist(rawText: string) {
  try {
    const result = await analyzeIntakeDraft(rawText);
    return { success: true as const, data: result };
  } catch (error) {
    if (error instanceof CaseAssistError) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "AI assistant is unavailable right now." };
  }
}
