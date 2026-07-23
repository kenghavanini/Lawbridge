'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LawyerJobs() {
  const [isDark, setIsDark] = useState(true);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [requested, setRequested] = useState<{ [key: string]: boolean }>({});

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
    const publicDefaults = [
      { 
        id: 1, 
        title: 'Series A Term Sheet Review', 
        practiceArea: 'Venture Capital', 
        urgency: 'Urgent', 
        budget: '$7,500', 
        summary: 'Corporate equity financing and governance protective provisions review.', 
        clientName: 'Acme Technologies Inc.',
        clientContact: 'founder@acmetech.io',
        status: 'Open for Counsel' 
      },
      { 
        id: 2, 
        title: 'IP Portfolio Assignment', 
        practiceArea: 'Intellectual Property', 
        urgency: 'Standard', 
        budget: '$4,000', 
        summary: 'Transfer of proprietary patent filings and software copyrights.', 
        clientName: 'Nexus Labs LLC',
        clientContact: 'legal@nexuslabs.co',
        status: 'Open for Counsel' 
      }
    ];

    const formattedSaved = parsedSaved.map((c: any) => ({
      id: c.id,
      title: c.title,
      practiceArea: c.practiceArea || 'Corporate',
      urgency: c.urgency || 'Standard',
      budget: c.budget || 'Negotiable',
      summary: c.description ? c.description.slice(0, 80) + '...' : 'Confidential client matter submitted for review.',
      clientName: c.clientName || 'Verified Client Entity #' + c.id.toString().slice(-4),
      clientContact: c.clientContact || 'client_secure_' + c.id + '@lawbridge.secure',
      status: 'Open for Counsel'
    }));

    setCases([...formattedSaved, ...publicDefaults]);
  }, []);

  const handleRequest = (c: any) => {
    setRequested({ ...requested, [c.id]: true });
    alert('Contact request successfully transmitted to ' + c.clientName + '. Full client details unlocked.');
  };

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>⚖️ LawBridge</span>
          <span style={{ border: '1px solid ' + borderColor, fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: subColor, fontFamily: 'monospace', textTransform: 'uppercase', backgroundColor: cardBg }}>Lawyer Command Center</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
          <Link href="/client" style={{ color: subColor, textDecoration: 'none' }}>Client Portal</Link>
          <Link href="/lawyer/verify" style={{ color: subColor, textDecoration: 'none' }}>Logout</Link>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Client Matter Open Queue</h1>
            <p style={{ color: subColor, fontSize: '0.875rem', margin: 0 }}>Browse available public matter summaries. Request client contact to unlock private details and initiate representation.</p>
          </div>
          <div style={{ border: '1px solid ' + borderColor, padding: '0.5rem 1rem', backgroundColor: cardBg, fontSize: '0.75rem', fontFamily: 'monospace', color: '#4f4' }}>
            ● Bar Verified Session Active
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cases.map((c) => (
            <div key={c.id} style={{ border: '1px solid ' + borderColor, padding: '1.5rem', backgroundColor: cardBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '600px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: textColor, margin: 0 }}>{c.title}</h3>
                  <span style={{ border: '1px solid ' + borderColor, fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: subColor, fontFamily: 'monospace', textTransform: 'uppercase' }}>{c.practiceArea}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: subColor, margin: '0 0 0.75rem 0' }}>{c.summary}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: subColor, fontFamily: 'monospace' }}>
                  <span>Urgency: {c.urgency}</span>
                  <span>•</span>
                  <span>Budget: {c.budget}</span>
                  <span>•</span>
                  <span>Client: {requested[c.id] ? c.clientName : '🔒 Confidential Entity'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column', minWidth: '180px' }}>
                <button onClick={() => handleRequest(c)} style={{ backgroundColor: requested[c.id] ? '#222' : textColor, color: requested[c.id] ? '#4f4' : bg, fontSize: '0.75rem', fontWeight: 'bold', padding: '0.75rem 1rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {requested[c.id] ? '✓ Contact Requested' : 'Request Client Contact'}
                </button>
                {requested[c.id] && (
                  <button onClick={() => setSelectedCase(c)} style={{ border: '1px solid ' + textColor, backgroundColor: 'transparent', color: textColor, fontSize: '0.75rem', fontWeight: 'bold', padding: '0.5rem 1rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                    View Client Info
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Info Modal / Drawer */}
      {selectedCase && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
          <div style={{ backgroundColor: cardBg, border: '1px solid ' + borderColor, padding: '2.5rem', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Client Credentials & Info</h3>
              <button onClick={() => setSelectedCase(null)} style={{ background: 'none', border: 'none', color: textColor, fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: subColor, fontFamily: 'monospace' }}>
              <div><strong style={{ color: textColor }}>Entity Name:</strong> {selectedCase.clientName}</div>
              <div><strong style={{ color: textColor }}>Matter:</strong> {selectedCase.title}</div>
              <div><strong style={{ color: textColor }}>Secured Contact Email:</strong> {selectedCase.clientContact}</div>
              <div><strong style={{ color: textColor }}>Retainer Tier:</strong> {selectedCase.budget}</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link href="/lawyer/drafting" style={{ flex: 1, backgroundColor: textColor, color: bg, padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Open Drafting Room
              </Link>
              <button onClick={() => setSelectedCase(null)} style={{ border: '1px solid ' + borderColor, background: 'transparent', color: textColor, padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Secure Lawyer Command Center.
      </footer>
    </main>
  );
}
