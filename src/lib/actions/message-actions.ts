"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getThreadMessages(threadId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`thread_id.eq.${threadId},case_id.eq.${threadId}`)
    .order("created_at", { ascending: true });

  if (error) {
    return [];
  }
  return data || [];
}

export async function sendMessage(threadId: string, content: string) {
  const supabase = await createServerSupabaseClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_id: auth.user.id,
      content,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/lawyer/${threadId}`);
  return { success: true, data };
}
