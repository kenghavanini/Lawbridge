'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClientHub() {
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

  const cards = [
    { title: 'Submit New Matter', desc: 'Configure practice areas, urgency levels, and budget tiers using drop-down menus.', href: '/client/submit' },
    { title: 'AI Legal Advisor', desc: 'Run instant vector-backed risk scans and clause recommendations on your agreements.', href: '/client/ai-advisor' },
    { title: 'Active Cases', desc: 'Monitor real-time attorney redlining progress and matter status updates.', href: '/client/cases' },
    { title: 'Document Vault', desc: 'Access AES-256 encrypted term sheets, contracts, and settlement agreements.', href: '/client/documents' },
    { title: 'Matter Pathway (Path)', desc: 'View milestone tracking, stage gates, and expected timeline projections for your matters.', href: '/client/path' },
    { title: 'Secure Inbox', desc: 'Direct encrypted communications and messaging threads with verified legal counsel.', href: '/client/inbox' },
    { title: 'Billing & Retainers', desc: 'Manage trust account balances, transparent itemized invoices, and escrow deposits.', href: '/client/billing' }
  ];

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Client Command Hub</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
          <Link href="/lawyer/verify" style={{ color: subColor, textDecoration: 'none' }}>Lawyer Portal</Link>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor }}>Secure Client Infrastructure</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0.5rem 0' }}>Client Command Hub</h1>
          <p style={{ color: subColor, fontSize: '0.875rem', margin: 0 }}>Manage your matters, run automated AI risk scans, and collaborate with verified legal counsel.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {cards.map((c, i) => (
            <Link key={i} href={c.href} style={{ border: '1px solid ' + borderColor, padding: '1.75rem', backgroundColor: cardBg, textDecoration: 'none', color: textColor, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.2s' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.75rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {c.title} <span style={{ color: subColor, fontSize: '0.9rem' }}>→</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: subColor, margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Enterprise Client Portal.
      </footer>
    </main>
  );
}
