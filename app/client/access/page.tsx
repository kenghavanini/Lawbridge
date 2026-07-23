'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClientAccess() {
  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [error, setError] = useState('');
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const check = () => setIsDark((localStorage.getItem('lawbridge_theme') || 'dark') === 'dark');
    check();
    window.addEventListener('theme-changed', check);
    return () => window.removeEventListener('theme-changed', check);
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem('lawbridge_client_guest_email');
    if (savedEmail) {
      setVerifiedEmail(savedEmail);
    }
    // Load lawyer requests for client cases
    const savedRequests = localStorage.getItem('lawbridge_lawyer_requests') || JSON.stringify([
      { id: 1, lawyerName: 'Vance & Associates LLP (Bar #999)', matterTitle: 'Series A Term Sheet Review', status: 'Pending Client Approval', date: '2026-07-23' },
      { id: 2, lawyerName: 'Apex Legal Counsel (Bar #412)', matterTitle: 'IP Portfolio Patent Assignment', status: 'Access Granted', date: '2026-07-22' }
    ]);
    setRequests(JSON.parse(savedRequests));
  }, []);

  const bg = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#050505' : '#f9f9f9';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subColor = isDark ? '#888888' : '#666666';
  const borderColor = isDark ? '#222222' : '#e0e0e0';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setVerifiedEmail(email);
    localStorage.setItem('lawbridge_client_guest_email', email);
  };

  const handleToggleAccess = (id: number) => {
    const updated = requests.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'Access Granted' ? 'Access Revoked' : 'Access Granted';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setRequests(updated);
    localStorage.setItem('lawbridge_lawyer_requests', JSON.stringify(updated));
  };

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Client Access & Permissions</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%', padding: '3rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ border: '1px solid ' + borderColor, padding: '2.5rem', backgroundColor: cardBg }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor }}>Secure Client Authentication</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.5rem 0' }}>Client Portal Access & Lawyer Permissions</h1>
            <p style={{ fontSize: '0.8rem', color: subColor, marginBottom: '0.5rem' }}>Enter your email to authenticate. (Test Client Email: <code style={{ color: '#4af' }}>founder@acmetech.io</code>)</p>
          </div>

          {error && (
            <div style={{ border: '1px solid #500', backgroundColor: '#200', padding: '0.75rem', fontSize: '0.75rem', color: '#fcc', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
              {error}
            </div>
          )}

          {!verifiedEmail ? (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '450px', margin: '0 auto' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: subColor, marginBottom: '0.5rem' }}>Client Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="founder@acmetech.io" required style={{ width: '100%', backgroundColor: bg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.875rem' }} />
              </div>
              <button type="submit" style={{ backgroundColor: textColor, color: bg, fontWeight: 'bold', padding: '0.875rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>
                Authenticate & Manage Access
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ border: '1px solid #0f0', backgroundColor: '#020', padding: '1rem', color: '#afa', fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Authenticated as: <strong>{verifiedEmail}</strong></span>
                <button onClick={() => setVerifiedEmail('')} style={{ background: 'none', border: '1px solid #afa', color: '#afa', padding: '0.25rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }}>Switch Email</button>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '1rem 0 0.5rem 0' }}>Lawyer Access Requests (Grant / Revoke)</h3>
              <p style={{ fontSize: '0.85rem', color: subColor, margin: '0 0 1rem 0' }}>Review which legal counsel have requested access to your confidential matters, and toggle permissions below.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {requests.map((req) => (
                  <div key={req.id} style={{ border: '1px solid ' + borderColor, padding: '1.25rem 1.5rem', backgroundColor: bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: textColor, margin: 0 }}>{req.lawyerName}</h4>
                        <span style={{ border: '1px solid ' + borderColor, fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: req.status === 'Access Granted' ? '#4f4' : req.status === 'Access Revoked' ? '#f55' : '#ff4', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                          {req.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: subColor, margin: '0 0 0.5rem 0' }}>Matter: {req.matterTitle}</p>
                      <span style={{ fontSize: '0.75rem', color: subColor, fontFamily: 'monospace' }}>Requested On: {req.date}</span>
                    </div>

                    <button
                      onClick={() => handleToggleAccess(req.id)}
                      style={{
                        backgroundColor: req.status === 'Access Granted' ? '#311' : '#131',
                        color: req.status === 'Access Granted' ? '#f88' : '#8f8',
                        border: '1px solid ' + borderColor,
                        padding: '0.75rem 1.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {req.status === 'Access Granted' ? 'Revoke Access' : 'Grant Access'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Secure Client Access Controls.
      </footer>
    </main>
  );
}
