'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SubmitMatter() {
  const [isDark, setIsDark] = useState(true);
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Venture Capital');
  const [budget, setBudget] = useState('$5,000');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = {
      id: Date.now(),
      title: title || 'Untitled Matter',
      practiceArea: area,
      urgency: 'High',
      budget: budget,
      description: desc || 'No description provided.',
      clientName: 'Verified Client Entity #' + Math.floor(1000 + Math.random() * 9000),
      clientContact: 'secure_client_' + Date.now().toString().slice(-4) + '@lawbridge.secure',
      status: 'Open for Counsel',
      date: new Date().toISOString().split('T')[0]
    };
    const existing = JSON.parse(localStorage.getItem('lawbridge_client_cases') || '[]');
    localStorage.setItem('lawbridge_client_cases', JSON.stringify([newCase, ...existing]));
    setSubmitted(true);
    setTimeout(() => router.push('/client/cases'), 1200);
  };

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Submit Matter</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid ' + borderColor, paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Submit New Legal Matter</h1>
          <p style={{ color: subColor, fontSize: '0.85rem', margin: 0 }}>Configure practice areas, budgets, and submit directly to counsel queue.</p>
        </div>

        {submitted ? (
          <div style={{ border: '1px solid #0f0', backgroundColor: '#020', padding: '1.5rem', textAlign: 'center', color: '#afa', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            ✓ Matter successfully dispatched to attorney review queue! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Matter Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Series A Term Sheet Review" required style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Practice Area</label>
                <select value={area} onChange={(e) => setArea(e.target.value)} style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }}>
                  <option value="Venture Capital">Venture Capital</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Corporate Governance">Corporate Governance</option>
                  <option value="Litigation & Dispute">Litigation & Dispute</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Budget Tier</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }}>
                  <option value="$2,500">$2,500 (Basic Review)</option>
                  <option value="$5,000">$5,000 (Standard Redline)</option>
                  <option value="$7,500">$7,500 (Comprehensive)</option>
                  <option value="$15,000">$15,000+ (Complex Litigation)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Matter Details & Objectives</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} placeholder="Describe key risk areas, counterparty details, and desired outcome..." required style={{ width: '100%', backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem', fontFamily: 'inherit' }} />
            </div>

            <button type="submit" style={{ backgroundColor: textColor, color: bg, fontWeight: 'bold', padding: '0.875rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Submit to Counsel Queue
            </button>
          </form>
        )}
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Secure Submission Portal.
      </footer>
    </main>
  );
}
