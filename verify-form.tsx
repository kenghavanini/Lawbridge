"use client";

import React, { useState } from "react";
import { submitLawyerVerification } from "@/lib/actions/verification-actions";

export function VerifyForm() {
  const [uiState, setUiState] = useState<"idle" | "submitting" | "error" | "rejected">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUiState("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const res = await submitLawyerVerification(formData);

    if (!res.success) {
      setUiState("error");
      setErrorMessage(res.error || "Submission failed");
    } else {
      setUiState("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Bar Number</label>
        <input name="barNumber" required className="mt-1 block w-full border rounded-md p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Jurisdiction</label>
        <input name="jurisdiction" required className="mt-1 block w-full border rounded-md p-2" />
      </div>
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      <button
        type="submit"
        disabled={uiState === "submitting"}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {uiState === "submitting" ? "Submitting..." : "Submit Verification"}
      </button>
    </form>
  );
}
