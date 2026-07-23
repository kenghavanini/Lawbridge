'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ActiveCases() {
  const [isDark, setIsDark] = useState(true);
  const [cases, setCases] = useState<any[]>([]);

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

  useEffect(() => {
    const saved = localStorage.getItem('lawbridge_client_cases');
    const parsedSaved = saved ? JSON.parse(saved) : [];
    const defaults = [
      { id: 1, title: 'Series A Term Sheet Review', practiceArea: 'Venture Capital', urgency: 'Urgent', budget: '$7,500', description: 'Multi-party liquidation preference dispute and protective provisions redline.', status: 'Pending Review', date: '2026-07-22' }
    ];
    setCases([...parsedSaved, ...defaults]);
  }, []);

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Active Cases</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Active Matter Dashboard</h1>
            <p style={{ color: subColor, fontSize: '0.875rem', margin: 0 }}>Monitor real-time attorney redlining progress and matter status updates.</p>
          </div>
          <Link href="/client/submit" style={{ backgroundColor: textColor, color: bg, padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 'bold', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            + Submit New Matter
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cases.map((c) => (
            <div key={c.id} style={{ border: '1px solid ' + borderColor, padding: '1.5rem', backgroundColor: cardBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '650px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: textColor, margin: 0 }}>{c.title}</h3>
                  <span style={{ border: '1px solid ' + borderColor, fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: subColor, fontFamily: 'monospace', textTransform: 'uppercase' }}>{c.status}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: subColor, margin: '0 0 0.75rem 0' }}>{c.description}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: subColor, fontFamily: 'monospace' }}>
                  <span>Area: {c.practiceArea || 'Corporate'}</span>
                  <span>•</span>
                  <span>Budget: {c.budget || 'Negotiable'}</span>
                  <span>•</span>
                  <span>Submitted: {c.date || '2026-07-22'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/client/inbox" style={{ border: '1px solid ' + textColor, color: textColor, padding: '0.6rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', textDecoration: 'none', textTransform: 'uppercase' }}>
                  Message Counsel
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Active Cases Tracker.
      </footer>
    </main>
  );
}
