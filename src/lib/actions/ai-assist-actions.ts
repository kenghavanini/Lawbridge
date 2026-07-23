'use server';

import { type CaseAssistResult } from "@/lib/ai/case-assist";

export async function runIntakeAssist(description: string): Promise<{ success: boolean; data?: CaseAssistResult; error?: string }> {
  try {
    const mockResult: CaseAssistResult = {
      suggestedTitle: "Automated Legal Review: " + description.slice(0, 30),
      suggestedPracticeArea: "corporate",
      summary: "AI parsed intake description successfully.",
      riskLevel: "medium",
      suggestedJurisdictionHint: "Federal",
      polishedSummary: "Polished summary for legal intake record.",
      notes: ["Verify all relevant documentation.", "Check jurisdiction constraints before filing."]
    };
    return { success: true, data: mockResult };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
