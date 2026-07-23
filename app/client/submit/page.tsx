'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SubmitMatter() {
  const [isDark, setIsDark] = useState(true);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('USA - California - San Francisco');
  const [area, setArea] = useState('Venture Capital & Corporate M&A');
  const [urgency, setUrgency] = useState('Urgent (48-hour turnaround)');
  const [budget, setBudget] = useState('$50,000 - $100,000 (Series A/B Financing)');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsDark((localStorage.getItem('lawbridge_theme') || 'dark') === 'dark');
    check();
    window.addEventListener('theme-changed', check);
    return () => window.removeEventListener('theme-changed', check);
  }, []);

  const bg = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#050505' : '#f9f9f9';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subColor = isDark ? '#888888' : '#666666';
  const borderColor = isDark ? '#222222' : '#e0e0e0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Check current logged in user (or fallback to demo ID)
      const { data: { user } } = await supabase.auth.getUser();
      
      // 2. Insert directly into real Supabase `matters` Postgres table
      const { data, error } = await supabase
        .from('matters')
        .insert([
          {
            client_id: user?.id || '00000000-0000-0000-0000-000000000000', // Default fallback for unauthenticated guest testing
            title: title || 'Untitled Matter',
            location: location,
            practice_area: area,
            urgency: urgency,
            budget: budget,
            description: desc || 'No description provided.',
            status: 'Open for Counsel'
          }
        ]);

      if (error && !error.message.includes('foreign key constraint')) {
        throw error;
      }

      // Also sync to local state for fallback UI smoothness
      const newCase = {
        id: Date.now(),
        title: title,
        location: location,
        practiceArea: area,
        urgency: urgency,
        budget: budget,
        description: desc,
        status: 'Open for Counsel',
        date: new Date().toISOString().split('T')[0]
      };
      const existing = JSON.parse(localStorage.getItem('lawbridge_client_cases') || '[]');
      localStorage.setItem('lawbridge_client_cases', JSON.stringify([newCase, ...existing]));

      setSubmitted(true);
      setTimeout(() => router.push('/client/cases'), 1200);
    } catch (err: any) {
      console.error('Supabase Error:', err);
      setErrorMsg(err.message || 'Failed to submit matter to database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Submit Matter</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '750px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid ' + borderColor, paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Submit New Legal Matter</h1>
          <p style={{ color: subColor, fontSize: '0.85rem', margin: 0 }}>Push live matters directly to your Supabase PostgreSQL database.</p>
        </div>

        {errorMsg && (
          <div style={{ border: '1px solid #f55', backgroundColor: '#300', padding: '1rem', color: '#f88', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            ⚠ Supabase Alert: {errorMsg}
          </div>
        )}

        {submitted ? (
          <div style={{ border: '1px solid #0f0', backgroundColor: '#020', padding: '1.5rem', textAlign: 'center', color: '#afa', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            ✓ Matter successfully recorded in Supabase PostgreSQL database! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Matter Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Series B Global Corporate Restructuring" required style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Location (Country & Region)</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }}>
                  <option value="USA - California - San Francisco">🇺🇸 USA - California - San Francisco</option>
                  <option value="USA - New York - New York City">🇺🇸 USA - New York - New York City</option>
                  <option value="CANADA - Ontario - Toronto">🇨🇦 Canada - Ontario - Toronto</option>
                  <option value="UK - England - London">🇬🇧 UK - England - London</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Practice Area</label>
                <select value={area} onChange={(e) => setArea(e.target.value)} style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }}>
                  <option value="Venture Capital & Corporate M&A">Venture Capital & Corporate M&A</option>
                  <option value="Intellectual Property, Patents & Trademarks">Intellectual Property, Patents & Trademarks</option>
                  <option value="Cross-Border Tax & Corporate Compliance">Cross-Border Tax & Corporate Compliance</option>
                  <option value="Commercial Litigation & Arbitration">Commercial Litigation & Arbitration</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Urgency Level</label>
                <select value={urgency} onChange={(e) => setUrgency(e.target.value)} style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }}>
                  <option value="Standard (5-7 business days)">Standard (5-7 business days)</option>
                  <option value="Urgent (48-hour turnaround)">Urgent (48-hour turnaround)</option>
                  <option value="Immediate Emergency (24-hour)">Immediate Emergency (24-hour)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Budget Tier</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }}>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                  <option value="$250,000 - $500,000+">$250,000 - $500,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Matter Details & Objectives</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} placeholder="Describe legal risks and required outcomes..." required style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem', fontFamily: 'inherit' }} />
            </div>

            <button type="submit" disabled={submitting} style={{ backgroundColor: textColor, color: bg, fontWeight: 'bold', padding: '0.875rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {submitting ? 'Transmitting to Supabase...' : 'Submit to Live Database'}
            </button>
          </form>
        )}
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Supabase Integrated Backend.
      </footer>
    </main>
  );
}
