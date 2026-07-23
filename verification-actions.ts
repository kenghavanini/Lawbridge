"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitLawyerVerification(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const barNumber = formData.get("barNumber") as string;
  const jurisdiction = formData.get("jurisdiction") as string;

  const { error } = await supabase.from("lawyer_profiles").upsert({
    id: auth.user.id,
    bar_number: barNumber,
    jurisdiction: jurisdiction,
    verification_status: "pending_review",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/lawyer");
  return { success: true };
}
