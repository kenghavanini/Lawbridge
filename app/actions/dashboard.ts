'use server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getUserDashboardData() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Unauthorized access');
  }

  const userId = session.user.id;
  const { data: matters } = await supabase.from('matters').select('*').eq('user_id', userId);
  const { data: invoices } = await supabase.from('invoices').select('*').eq('user_id', userId);
  const { data: documents } = await supabase.from('documents').select('*').eq('user_id', userId);

  return { 
    matters: matters || [], 
    invoices: invoices || [], 
    documents: documents || [] 
  };
}
