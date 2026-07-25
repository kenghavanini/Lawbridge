import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { reqId, matterId } = await req.json();
    
    // Update request status to approved
    await supabase.from('access_requests').update({ status: 'approved' }).eq('id', reqId);
    
    // In a real app, you would also insert a record into a `matter_access_grants` table here
    // to instantly grant the specific lawyer access to the restricted matter details.

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
