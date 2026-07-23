'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClientBilling() {
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

  const invoices = [
    { id: 'INV-2026-01', desc: 'Series A Term Sheet Review & Redline', amount: '$7,500.00', status: 'Paid', date: '2026-07-22' },
    { id: 'INV-2026-02', desc: 'AI Precedent Scan & Compliance Retainer', amount: '$2,500.00', status: 'Pending', date: '2026-07-01' }
  ];

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Billing & Retainers</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Billing & Trust Retainers</h1>
            <p style={{ color: subColor, fontSize: '0.875rem', margin: 0 }}>Manage trust account balances, itemized invoices, and escrow deposits.</p>
          </div>
          <div style={{ border: '1px solid ' + borderColor, padding: '0.75rem 1.25rem', backgroundColor: cardBg, fontSize: '0.85rem', fontFamily: 'monospace' }}>
            Trust Balance: <span style={{ color: '#4f4', fontWeight: 'bold' }}>$12,500.00</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {invoices.map((inv, i) => (
            <div key={i} style={{ border: '1px solid ' + borderColor, padding: '1.25rem 1.5rem', backgroundColor: cardBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: textColor, margin: 0 }}>{inv.id}</h3>
                  <span style={{ border: '1px solid ' + borderColor, fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: inv.status === 'Paid' ? '#4f4' : '#ff4', fontFamily: 'monospace' }}>{inv.status}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: subColor, margin: '0 0 0.5rem 0' }}>{inv.desc}</p>
                <span style={{ fontSize: '0.75rem', color: subColor, fontFamily: 'monospace' }}>Issued: {inv.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{inv.amount}</span>
                <button onClick={() => alert('Invoice payment processed successfully.')} style={{ backgroundColor: textColor, color: bg, padding: '0.6rem 1.2rem', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>
                  {inv.status === 'Paid' ? 'Receipt' : 'Pay Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Escrow & Billing Portal.
      </footer>
    </main>
  );
}
