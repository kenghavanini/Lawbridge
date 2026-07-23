export interface CaseAssistResult {
  suggestedTitle: string;
  suggestedPracticeArea: string;
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  suggestedJurisdictionHint?: string;
  polishedSummary?: string;
  notes?: string[];
}

export class CaseAssistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CaseAssistError";
  }
}

export async function analyzeIntakeDraft(rawText: string): Promise<CaseAssistResult> {
  if (!rawText || rawText.trim().length === 0) {
    throw new CaseAssistError("Intake text cannot be empty.");
  }
  return {
    suggestedTitle: "Automated Legal Review: " + rawText.slice(0, 30),
    suggestedPracticeArea: "corporate",
    summary: "AI parsed intake description successfully.",
    riskLevel: "medium",
    suggestedJurisdictionHint: "Federal",
    polishedSummary: "Polished summary for legal intake record.",
    notes: ["Verify all relevant documentation.", "Check jurisdiction constraints before filing."]
  };
}
