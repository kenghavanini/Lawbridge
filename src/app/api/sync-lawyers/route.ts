import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grdirmuoecdyxbkismvo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fjq_fR34HKuiUZoI-m7i2w_oO0px8eY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    // Expects an array of lawyer records: [{ firstName, lastName, barId, jurisdiction, email }]
    const body = await request.json();
    const lawyersList = Array.isArray(body) ? body : [body];

    const formattedLawyers = lawyersList.map(lawyer => ({
      first_name: lawyer.firstName?.trim(),
      last_name: lawyer.lastName?.trim(),
      bar_id: lawyer.barId?.trim(),
      jurisdiction: lawyer.jurisdiction?.trim(),
      email: lawyer.email?.trim() || null,
      status: 'Active',
      updated_at: new Date().toISOString()
    }));

    // Upsert (Insert or Update existing records based on unique bar_id)
    const { data, error } = await supabase
      .from('lawyers')
      .upsert(formattedLawyers, { onConflict: 'bar_id' })
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${data.length} lawyer record(s) into Supabase database.`,
      data
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
