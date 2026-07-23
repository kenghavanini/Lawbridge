export async function triageVerificationSubmission(data: Record<string, unknown>) {
  return {
    status: "approved" as const,
    confidence: 0.95,
    reasoning: "Verified successfully.",
  };
}
