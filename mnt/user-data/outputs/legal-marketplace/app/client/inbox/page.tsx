'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SecureInbox() {
  const [isDark, setIsDark] = useState(true);
  const [messages, setMessages] = useState([
    { sender: 'Counsel (Mr. Vance, Esq.)', time: '10:14 AM', text: 'We have reviewed the liquidation preference clause. Recommending a 1x non-participating structure.' },
    { sender: 'You', time: '10:20 AM', text: 'Understood. Please proceed with drafting that redline in the active matter queue.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

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

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([...messages, { sender: 'You', time: 'Just now', text: inputMsg }]);
    setInputMsg('');
  };

  return (
    <main style={{ backgroundColor: bg, color: textColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', transition: 'background 0.2s, color 0.2s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + borderColor, paddingBottom: '1.5rem' }}>
        <Link href="/client" style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor, textDecoration: 'none' }}>
          ⚖️ LawBridge <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 'normal', marginLeft: '0.5rem' }}>/ Secure Inbox</span>
        </Link>
        <Link href="/client" style={{ color: subColor, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Hub</Link>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '2rem 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid ' + borderColor, paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Encrypted Counsel Inbox</h1>
          <p style={{ color: subColor, fontSize: '0.85rem', margin: 0 }}>Direct secure communication channel with assigned legal representation.</p>
        </div>

        <div style={{ border: '1px solid ' + borderColor, backgroundColor: cardBg, padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '400px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', marginBottom: '1.5rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ border: '1px solid ' + borderColor, padding: '1rem', backgroundColor: bg, maxWidth: '75%', alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: subColor, fontFamily: 'monospace' }}>
                  <span>{m.sender}</span>
                  <span>{m.time}</span>
                </div>
                <p style={{ fontSize: '0.875rem', margin: 0, color: textColor }}>{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={send} style={{ display: 'flex', gap: '1rem' }}>
            <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder="Type encrypted message to counsel..." style={{ flex: 1, backgroundColor: bg, border: '1px solid ' + borderColor, padding: '0.75rem', color: textColor, outline: 'none', fontSize: '0.85rem' }} />
            <button type="submit" style={{ backgroundColor: textColor, color: bg, fontWeight: 'bold', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Send
            </button>
          </form>
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, borderTop: '1px solid ' + borderColor, paddingTop: '1.5rem' }}>
        © 2026 LawBridge Systems. Encrypted Messaging.
      </footer>
    </main>
  );
}
