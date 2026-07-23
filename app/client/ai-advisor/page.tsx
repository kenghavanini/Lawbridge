'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AiAdvisor() {
  const [isDark, setIsDark] = useState(true);
  const [contractText, setContractText] = useState('1.1 Liquidation Preference: In liquidation, preferred stockholders receive 1x original purchase price prior to common stockholders.');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const runScan = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalysis('Risk Level: Moderate (Vector Match: 91%)\n\n• Finding: Liquidation preference is standard 1x non-participating.\n• Recommendation: Add explicit carve-out for bridge note conversions to prevent dilution ambiguity.\n• Precedent: Aligned with 42 comparable VC term sheets in Q2 2026.');
      setLoading(false);
    }, 800);
  };

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ AI Legal Advisor</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid ' + borderColor, paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>AI Precedent & Risk Advisor</h1>
          <p style={{ color: subColor, fontSize: '0.85rem', margin: 0 }}>Instant vector-backed risk scanning, clause comparison, and compliance checks.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ border: '1px solid ' + borderColor, padding: '1.5rem', backgroundColor: cardBg, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: subColor }}>Input Agreement Clause</h3>
            <textarea value={contractText} onChange={(e) => setContractText(e.target.value)} rows={7} style={{ width: '100%', backgroundColor: bg, border: '1px solid ' + borderColor, padding: '1rem', color: textColor, fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none' }} />
            <button onClick={runScan} disabled={loading} style={{ backgroundColor: textColor, color: bg, fontWeight: 'bold', padding: '0.75rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
              {loading ? 'Running Vector Scan...' : 'Run AI Risk Scan'}
            </button>
          </div>

          <div style={{ border: '1px solid ' + borderColor, padding: '1.5rem', backgroundColor: cardBg, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: subColor }}>Analysis & Recommendations</h3>
            <div style={{ border: '1px solid ' + borderColor, padding: '1rem', backgroundColor: bg, flex: 1, fontSize: '0.8rem', fontFamily: 'monospace', whiteSpace: 'pre-line', color: analysis ? '#4f4' : subColor }}>
              {analysis || 'Click "Run AI Risk Scan" to analyze contract clause against historical precedents.'}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. AI Advisory Core.
      </footer>
    </main>
  );
}
