'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCaseIntake(formData: {
  title: string
  anonymized_summary: string
  full_description: string
  practice_area: string
  jurisdiction_id: string
  budget_min_cents?: number
  budget_max_cents?: number
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized. Please log in as a client.' }
  }

  const { data, error } = await supabase
    .from('cases')
    .insert({
      client_id: user.id,
      title: formData.title,
      anonymized_summary: formData.anonymized_summary,
      full_description: formData.full_description,
      practice_area: formData.practice_area,
      jurisdiction_id: formData.jurisdiction_id,
      budget_min_cents: formData.budget_min_cents || 0,
      budget_max_cents: formData.budget_max_cents || null,
      status: 'draft',
      verification_status: 'pending'
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/client')
  return { success: true, data }
}
