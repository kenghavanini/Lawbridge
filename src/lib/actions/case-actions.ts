"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCaseSchema, type CreateCaseInput } from "@/lib/validations/case";

export async function createCase(input: CreateCaseInput): Promise<{ success: true; caseId: string; data: Record<string, unknown> } | { success: false; error: string }> {
  const parsed = createCaseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form input" };
  }

  const supabase = await createServerSupabaseClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase.from("cases").insert({
    client_id: auth.user.id,
    title: parsed.data.title,
    anonymized_summary: parsed.data.anonymizedSummary,
    full_description: parsed.data.fullDescription,
    practice_area: parsed.data.practiceArea,
    jurisdiction_id: parsed.data.jurisdictionId,
    budget_min_cents: parsed.data.budgetMinCents ?? null,
    budget_max_cents: parsed.data.budgetMaxCents ?? null,
    status: "open",
  }).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, caseId: data.id as string, data: data as Record<string, unknown> };
}

export async function uploadCaseDocuments(caseIdOrFormData: string | FormData, maybeFormData?: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const caseId = typeof caseIdOrFormData === "string" ? caseIdOrFormData : undefined;
  let formData = typeof caseIdOrFormData === "string" ? maybeFormData : caseIdOrFormData;

  if (!formData && caseIdOrFormData instanceof FormData) {
    formData = caseIdOrFormData;
  }

  if (!formData) {
    return { success: true };
  }

  const files = formData.getAll("files") || formData.getAll("document");
  for (const file of files) {
    if (file instanceof File && file.size > 0) {
      const prefix = caseId ? `${auth.user.id}/${caseId}` : `${auth.user.id}/temp`;
      const filePath = `${prefix}/${Date.now()}_${file.name}`;
      await supabase.storage.from("case-documents").upload(filePath, file);
    }
  }

  return { success: true };
}

export async function requestCaseMatch(caseId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("case_matches").insert({
    case_id: caseId,
    lawyer_id: auth.user.id,
    status: "pending",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/lawyer/${caseId}`);
  return { success: true };
}

export async function respondToMatchRequest(matchIdOrCaseId: string, statusOrAction?: string) {
  const supabase = await createServerSupabaseClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("case_matches")
    .update({ status: statusOrAction ?? "accepted" })
    .eq("id", matchIdOrCaseId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
