/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { Sparkles, Loader2, Upload, X, FileText } from "lucide-react";
import { createCase, uploadCaseDocuments } from "@/lib/actions/case-actions";
import { runIntakeAssist } from "@/lib/actions/ai-assist-actions";
import { PRACTICE_AREA_OPTIONS, PRACTICE_AREA_LABELS } from "@/lib/constants/practice-areas";
import type { PracticeArea } from "@/lib/types/database.types";
import type { CaseAssistResult } from "@/lib/ai/case-assist";

type JurisdictionOption = {
  id: string;
  country_code: string;
  region_name: string | null;
  city: string | null;
};

function jurisdictionLabel(j: JurisdictionOption): string {
  if (j.city) return `${j.city}, ${j.region_name ?? j.country_code}`;
  return j.region_name ? `${j.region_name}, ${j.country_code}` : j.country_code;
}

function findMatchingJurisdiction(hint: string, jurisdictions: JurisdictionOption[]): JurisdictionOption | null {
  if (!hint.trim()) return null;
  const lower = hint.toLowerCase();
  return (
    jurisdictions.find(
      (j) => (j.city && lower.includes(j.city.toLowerCase())) || (j.region_name && lower.includes(j.region_name.toLowerCase()))
    ) ?? null
  );
}

function fallbackSummary(category: PracticeArea): string {
  return `A prospective client is seeking counsel on a ${PRACTICE_AREA_LABELS[category].toLowerCase()} matter. Full details are available once a match is accepted.`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ClientCaseForm({ jurisdictions }: { jurisdictions: JurisdictionOption[] }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PracticeArea>("corporate");
  const [jurisdictionId, setJurisdictionId] = useState(jurisdictions[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [publicSummary, setPublicSummary] = useState("");
  const [budget, setBudget] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [aiState, setAiState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [aiResult, setAiResult] = useState<CaseAssistResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  function handleRunAssist() {
    setAiState("loading");
    setAiError(null);
    startTransition(async () => {
      const result = await runIntakeAssist(description);
      if (!result.success) {
        setAiState("error");
        setAiError(result.error ? String(result.error) : "An error occurred");
        return;
      }
      setAiResult(result.data ?? null);
      setAiState("done");
    });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(false);

    if (!title.trim() || !jurisdictionId || !description.trim() || !budget) {
      setError("Please fill in every field before posting.");
      return;
    }
    setError(null);

    startTransition(async () => {
      const anonymizedSummary = publicSummary.trim() || fallbackSummary(category);

      const result = await createCase({
        rawDescription: description.trim(),
        title: title.trim(),
        anonymizedSummary,
        fullDescription: description.trim(),
        practiceArea: category,
        jurisdictionId,
        budgetMinCents: Math.round(Number(budget) * 100),
        budgetMaxCents: null,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const uploadResult = await uploadCaseDocuments(result.caseId, formData);
        if (!uploadResult.success) {
          setError(`Case posted, but document upload failed: ${uploadResult.error}`);
          setSuccess(true);
          return;
        }
      }

      setSuccess(true);
      setTitle("");
      setDescription("");
      setPublicSummary("");
      setBudget("");
      setFiles([]);
      setAiResult(null);
      setAiState("idle");
    });
  }

  const matchingJurisdiction = aiResult ? findMatchingJurisdiction(aiResult.suggestedJurisdictionHint ?? "", jurisdictions) : null;

  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Post a new legal case</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="case-title" className="text-sm font-medium text-foreground">
            Case title
          </label>
          <input
            id="case-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Commercial lease dispute"
            className="mt-2 w-full border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="case-category" className="text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="case-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as PracticeArea)}
            className="mt-2 w-full border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {PRACTICE_AREA_OPTIONS.map((area) => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="case-jurisdiction" className="text-sm font-medium text-foreground">
            Jurisdiction
          </label>
          {jurisdictions.length === 0 ? (
            <p className="mt-2 text-xs text-destructive">
              No jurisdictions found — seed the `jurisdictions` table (see schema.sql) before this form can be
              submitted.
            </p>
          ) : (
            <select
              id="case-jurisdiction"
              value={jurisdictionId}
              onChange={(e) => setJurisdictionId(e.target.value)}
              className="mt-2 w-full border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {jurisdictions.map((j) => (
                <option key={j.id} value={j.id}>
                  {jurisdictionLabel(j)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="case-description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="case-description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your situation…"
            className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            type="button"
            onClick={handleRunAssist}
            disabled={aiState === "loading" || description.trim().length < 20}
            className="btn-label mt-2 flex items-center gap-2 border border-border px-3 py-1.5 text-xs text-foreground transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {aiState === "loading" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" /> AI Assist
              </>
            )}
          </button>

          {aiError && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {aiError}
            </p>
          )}

          {aiResult && (
            <div className="mt-3 space-y-4 border border-border p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Suggested category</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-sm text-foreground">{PRACTICE_AREA_LABELS[aiResult.suggestedPracticeArea]}</span>
                  <button
                    type="button"
                    onClick={() => setCategory(aiResult.suggestedPracticeArea as unknown as Parameters<typeof setCategory>[0])}
                    className="btn-label text-xs underline underline-offset-4"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {matchingJurisdiction && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Suggested jurisdiction</p>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-sm text-foreground">{jurisdictionLabel(matchingJurisdiction)}</span>
                    <button
                      type="button"
                      onClick={() => setJurisdictionId(matchingJurisdiction.id)}
                      className="btn-label text-xs underline underline-offset-4"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Polished public summary</p>
                <p className="mt-1 text-sm text-foreground">{aiResult.polishedSummary}</p>
                <button
                  type="button"
                  onClick={() => setPublicSummary(aiResult.polishedSummary ?? "")}
                  className="btn-label mt-2 text-xs underline underline-offset-4"
                >
                  Use this
                </button>
              </div>

              {(aiResult.notes ?? []).length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
                  <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
                    {(aiResult.notes ?? []).map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {publicSummary && (
            <div className="mt-3">
              <label htmlFor="public-summary" className="text-xs font-medium text-foreground">
                Public summary (what lawyers see before unlock)
              </label>
              <textarea
                id="public-summary"
                rows={3}
                value={publicSummary}
                onChange={(e) => setPublicSummary(e.target.value)}
                className="mt-1 w-full border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="case-budget" className="text-sm font-medium text-foreground">
            Budget (USD)
          </label>
          <input
            id="case-budget"
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="2500"
            className="mt-2 w-full border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Supporting documents (optional)</label>
          <p className="mt-1 text-xs text-muted-foreground">
            Court papers, summons, legal notices, contracts, or financial statements. Images or PDF. Stays locked
            with the rest of your case until you accept a lawyer's request.
          </p>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center border border-dashed border-border py-8 text-center">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">Click to choose files</span>
            <input type="file" multiple accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
          </label>
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file, i) => (
                <li key={`${file.name}-${i}`} className="flex items-center justify-between border border-border px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {file.name}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                    <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${file.name}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {success && <p className="text-sm text-foreground">Case posted — it's now live on the real case board.</p>}

        <button
          type="submit"
          disabled={isPending || jurisdictions.length === 0}
          className="btn-label bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Posting…" : "Post case"}
        </button>
      </form>
    </section>
  );
}









