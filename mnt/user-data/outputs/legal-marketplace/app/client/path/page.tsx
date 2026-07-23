'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MatterPath() {
  const [isDark, setIsDark] = useState(true);

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

  const milestones = [
    { phase: 'Phase 1: Intake & AI Risk Scan', status: 'Completed', date: '2026-07-22', desc: 'Vector risk analysis completed successfully with 91% precedent alignment.' },
    { phase: 'Phase 2: Attorney Redlining & Review', status: 'In Progress', date: 'Estimated 2026-07-24', desc: 'Senior counsel reviewing liquidation preference and protective provisions.' },
    { phase: 'Phase 3: Counterparty Negotiation', status: 'Upcoming', date: 'Estimated 2026-07-28', desc: 'Joint negotiation session and final markup exchange.' },
    { phase: 'Phase 4: Execution & Vault Archive', status: 'Upcoming', date: 'Estimated 2026-07-31', desc: 'Digital signature execution via RLS secure channel and AES-256 vault archiving.' }
  ];

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Matter Pathway</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid ' + borderColor, paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Matter Pathway & Timeline</h1>
          <p style={{ color: subColor, fontSize: '0.85rem', margin: 0 }}>Real-time stage tracking, milestone gates, and expected completion projections.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ border: '1px solid ' + borderColor, padding: '1.5rem', backgroundColor: cardBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '600px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: subColor, textTransform: 'uppercase' }}>{m.date}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0.25rem 0 0.5rem 0' }}>{m.phase}</h3>
                <p style={{ fontSize: '0.85rem', color: subColor, margin: 0 }}>{m.desc}</p>
              </div>
              <span style={{ border: '1px solid ' + borderColor, padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontFamily: 'monospace', color: m.status === 'Completed' ? '#4f4' : m.status === 'In Progress' ? '#ff4' : subColor, backgroundColor: bg }}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Matter Pathway Tracker.
      </footer>
    </main>
  );
}
