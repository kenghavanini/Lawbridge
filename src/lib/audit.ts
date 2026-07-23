import { supabase } from '@/lib/supabase';

export async function logSecurityEvent(action: string, resourceType: string, metadata: object = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert([
      {
        user_id: user.id,
        action,
        resource_type: resourceType,
        metadata
      }
    ]);
  } catch (err) {
    console.error("Failed to record security audit log:", err);
  }
}
