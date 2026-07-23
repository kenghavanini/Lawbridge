'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LawyerDraftingRoom() {
  const [isDark, setIsDark] = useState(true);
  const [clauseText, setClauseText] = useState('1.1 Liquidation Preference: In the event of any liquidation, dissolution, or winding up of the Corporation, the proceeds shall be distributed first to the Series A Preferred Stockholders.');
  const [status, setStatus] = useState('Drafting / Redlining');

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

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>⚖️ LawBridge</span>
          <span style={{ border: '1px solid ' + borderColor, fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: subColor, fontFamily: 'monospace', textTransform: 'uppercase', backgroundColor: cardBg }}>Secure Drafting Room</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
          <Link href="/lawyer/jobs" style={{ color: textColor, textDecoration: 'none' }}>← Back to Job Queue</Link>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>Matter Drafting & Redline Workspace</h1>
            <p style={{ color: subColor, fontSize: '0.85rem', margin: 0 }}>Collaborative real-time editing with AI risk scoring and RLS security.</p>
          </div>
          <span style={{ border: '1px solid ' + borderColor, padding: '0.5rem 1rem', backgroundColor: cardBg, fontSize: '0.75rem', fontFamily: 'monospace', color: '#4f4' }}>
            Status: {status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ border: '1px solid ' + borderColor, padding: '1.5rem', backgroundColor: cardBg, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: subColor }}>Live Clause Editor</h3>
            <textarea value={clauseText} onChange={(e) => setClauseText(e.target.value)} rows={8} style={{ width: '100%', backgroundColor: bg, border: '1px solid ' + borderColor, padding: '1rem', color: textColor, fontSize: '0.9rem', fontFamily: 'monospace', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => alert('Changes saved and synchronized with client portal.')} style={{ backgroundColor: textColor, color: bg, fontWeight: 'bold', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Save & Push Redline
              </button>
              <button onClick={() => setStatus('Approved & Executed')} style={{ border: '1px solid ' + textColor, backgroundColor: 'transparent', color: textColor, fontWeight: 'bold', padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Approve & Finalize
              </button>
            </div>
          </div>

          <div style={{ border: '1px solid ' + borderColor, padding: '1.5rem', backgroundColor: cardBg, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: subColor }}>AI Precedent Guard</h3>
            <p style={{ fontSize: '0.8rem', color: subColor, margin: 0 }}>Vector search indicates similar liquidation clauses resolved with 1x non-participating preferred structures in 94% of comparable cases.</p>
            <div style={{ border: '1px solid ' + borderColor, padding: '0.75rem', backgroundColor: bg, fontSize: '0.75rem', fontFamily: 'monospace', color: '#ff4' }}>
              ⚠️ Risk Alert: Ensure seniority definition explicitly excludes bridge notes.
            </div>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Secure Drafting Terminal.
      </footer>
    </main>
  );
}
