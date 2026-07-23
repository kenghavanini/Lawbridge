'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LawyerVerify() {
  const [isDark, setIsDark] = useState(true);
  const [barId, setBarId] = useState('');
  const [error, setError] = useState('');
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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (barId.trim() !== 'BAR-2026-TEST-999') {
      setError('Invalid Bar ID credential.');
      return;
    }
    localStorage.setItem('lawbridge_lawyer_verified', 'true');
    router.push('/lawyer/jobs');
  };

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Counsel Verification</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>Client Portal</Link>
      </header>

      <div style={{ maxWidth: '450px', margin: '0 auto', width: '100%', border: '1px solid ' + borderColor, padding: '2.5rem', backgroundColor: cardBg }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor }}>Restricted Access</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0' }}>Lawyer Credential Verification</h1>
          <p style={{ fontSize: '0.8rem', color: subColor, marginBottom: '1rem' }}>Enter your Bar association ID to access secure review queues.</p>
        </div>

        {error && (
          <div style={{ border: '1px solid #500', backgroundColor: '#200', padding: '0.75rem', fontSize: '0.75rem', color: '#fcc', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Bar Association ID</label>
            <input type="text" value={barId} onChange={(e) => setBarId(e.target.value)} placeholder="Enter Bar ID" required style={{ width: '100%', backgroundColor: bg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem', fontFamily: 'monospace' }} />
          </div>
          <button type="submit" style={{ backgroundColor: textColor, color: bg, fontWeight: 'bold', padding: '0.875rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>
            Verify & Enter Command Center
          </button>
        </form>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Secure Authentication.
      </footer>
    </main>
  );
}
