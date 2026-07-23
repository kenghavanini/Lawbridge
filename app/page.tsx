'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
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

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
          ⚖️ LawBridge
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
          <Link href="/client" style={{ color: subColor, textDecoration: 'none' }}>Client Portal</Link>
          <Link href="/lawyer/verify" style={{ color: subColor, textDecoration: 'none' }}>Lawyer Command Center</Link>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ display: 'inline-block', border: '1px solid ' + borderColor, padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '1.5rem', backgroundColor: cardBg }}>
          Enterprise-Grade Legal Infrastructure
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          The Autonomous Operating System for Legal Practice
        </h1>
        <p style={{ color: subColor, fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          Real-time multi-user redlining, AI-powered contract risk analysis, and automated escrow settlement backed by bank-grade vector search and RLS security.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/lawyer/verify" style={{ backgroundColor: textColor, color: bg, padding: '0.875rem 2rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid ' + textColor }}>
            Launch Lawyer Workspace
          </Link>
          <Link href="/client" style={{ border: '1px solid ' + textColor, color: textColor, padding: '0.875rem 2rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            View Client Portal
          </Link>
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem', marginTop: '3rem' }}>
        © 2026 LawBridge Systems. All rights reserved.
      </footer>
    </main>
  );
}