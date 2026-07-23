'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocumentVault() {
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

  const docs = [
    { name: 'Series_A_Term_Sheet_Final_Redline.pdf', size: '2.4 MB', date: '2026-07-22', status: 'AES-256 Encrypted' },
    { name: 'Founder_IP_Assignment_Agreement.docx', size: '1.1 MB', date: '2026-07-18', status: 'Executed' },
    { name: 'Safe_Note_Convertible_2026.pdf', size: '840 KB', date: '2026-06-30', status: 'Verified' }
  ];

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Document Vault</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Secure Document Vault</h1>
            <p style={{ color: subColor, fontSize: '0.875rem', margin: 0 }}>AES-256 encrypted storage for term sheets, contracts, and settlement files.</p>
          </div>
          <button onClick={() => alert('File upload simulated successfully.')} style={{ backgroundColor: textColor, color: bg, padding: '0.75rem 1.25rem', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            + Upload Document
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {docs.map((d, i) => (
            <div key={i} style={{ border: '1px solid ' + borderColor, padding: '1.25rem 1.5rem', backgroundColor: cardBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: textColor, margin: '0 0 0.25rem 0' }}>{d.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: subColor, fontFamily: 'monospace' }}>
                  <span>Size: {d.size}</span>
                  <span>•</span>
                  <span>Uploaded: {d.date}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ border: '1px solid ' + borderColor, fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: '#4f4', fontFamily: 'monospace' }}>{d.status}</span>
                <button onClick={() => alert('Downloading ' + d.name)} style={{ border: '1px solid ' + textColor, backgroundColor: 'transparent', color: textColor, padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. AES-256 Storage Vault.
      </footer>
    </main>
  );
}
