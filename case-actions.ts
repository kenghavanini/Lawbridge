"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCaseSchema, type CreateCaseInput } from "@/lib/validations/case";

export async function createCase(input: CreateCaseInput) {
  const parsed = createCaseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid case data." };
  }

  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { success: false as const, error: "You must be signed in to submit a case." };
  }

  const { data: caseRow, error } = await supabase
    .from("cases")
    .insert({
      client_id: auth.user.id,
      title: parsed.data.title,
      anonymized_summary: parsed.data.anonymizedSummary,
      full_description: parsed.data.fullDescription,
      practice_area: parsed.data.practiceArea,
      jurisdiction_id: parsed.data.jurisdictionId,
      budget_min_cents: parsed.data.budgetMinCents,
      budget_max_cents: parsed.data.budgetMaxCents,
      status: "open",
    })
    .select("id")
    .single();

  if (error || !caseRow) {
    return { success: false as const, error: `Could not create case: ${error?.message ?? "unknown error"}` };
  }

  revalidatePath("/lawyer");
  revalidatePath("/client");
  return { success: true as const, caseId: caseRow.id };
}

export async function uploadCaseDocuments(caseId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { success: false as const, error: "You must be signed in." };
  }

  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
  const uploaded: string[] = [];

  for (const file of files) {
    const path = `${caseId}/${randomUUID()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("case-documents")
      .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return { success: false as const, error: `Failed to upload ${file.name}: ${uploadError.message}` };
    }

    const { error: insertError } = await supabase.from("case_documents").insert({
      case_id: caseId,
      uploaded_by: auth.user.id,
      storage_path: path,
      document_type: "case_evidence",
      file_name: file.name,
      file_size_bytes: file.size,
      mime_type: file.type || "application/octet-stream",
    });

    if (insertError) {
      return { success: false as const, error: `Uploaded ${file.name} but failed to record it: ${insertError.message}` };
    }

    uploaded.push(path);
  }

  revalidatePath(`/lawyer/${caseId}`);
  return { success: true as const, uploaded };
}

export async function requestCaseMatch(caseId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { success: false as const, error: "You must be signed in." };
  }

  // maybeSingle, not single: a lawyer who hasn't submitted /verify yet has
  // no lawyer_profiles row at all — that must fall through to the "only
  // verified lawyers" message below, not throw an unhandled query error.
  const { data: lawyerProfile } = await supabase
    .from("lawyer_profiles")
    .select("verification_status")
    .eq("id", auth.user.id)
    .maybeSingle();

  const hasBoardAccess =
    lawyerProfile?.verification_status === "approved" || lawyerProfile?.verification_status === "pending_review";

  if (!hasBoardAccess) {
    return { success: false as const, error: "Complete verification before requesting cases." };
  }

  const { error } = await supabase.from("case_matches").insert({
    case_id: caseId,
    lawyer_id: auth.user.id,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false as const, error: "You have already requested this case." };
    }
    return { success: false as const, error: `Could not request case: ${error.message}` };
  }

  revalidatePath(`/lawyer/${caseId}`);
  return { success: true as const };
}

/**
 * Accept/decline by the client, or withdraw by the requesting lawyer, all
 * flow through this one function — RLS (see case_matches_update in
 * schema.sql) is what actually enforces who may set which value. We detect
 * an RLS-blocked update by re-selecting after the update: with RLS, a
 * write that matches zero rows returns success with no error, not a 403 —
 * `.select().single()` turns that silent no-op into a catchable error
 * instead of a UI that quietly does nothing.
 */
export async function respondToMatchRequest(matchId: string, decision: "accepted" | "declined" | "withdrawn") {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { success: false as const, error: "You must be signed in." };
  }

  const { data: updated, error } = await supabase
    .from("case_matches")
    .update({ status: decision, responded_at: new Date().toISOString() })
    .eq("id", matchId)
    .select("id, case_id")
    .single();

  if (error || !updated) {
    return { success: false as const, error: "You're not authorized to update this request, or it no longer exists." };
  }

  revalidatePath(`/lawyer/${updated.case_id}`);
  return { success: true as const };
}
