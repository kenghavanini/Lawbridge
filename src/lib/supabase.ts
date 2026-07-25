import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grdirmuoecdyxbkismvo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fjq_fR34HKuiUZoI-m7i2w_oO0px8eY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
