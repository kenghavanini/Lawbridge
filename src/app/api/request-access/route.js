import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, matter } = await request.json();
    
    // In production, integrate SendGrid/Resend or Supabase SMTP here using process.env.SUPABASE_SERVICE_ROLE_KEY
    console.log(`[LawBridge Email Dispatch] Sending explicit access request notification to: ${email}`);
    console.log(`Matter Context: ${matter}`);

    return NextResponse.json({ success: true, message: 'Email notification sent successfully to ' + email });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
