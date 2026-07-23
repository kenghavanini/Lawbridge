'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the confirmation link!');
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      router.push('/client'); // Redirect to hub after login
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff', padding: '2rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', border: '1px solid #333', padding: '2rem', backgroundColor: '#050505' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>⚖️ LawBridge Access</h1>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff' }} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={handleLogin} disabled={loading} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
            <button onClick={handleSignUp} disabled={loading} style={{ flex: 1, padding: '0.75rem', backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', cursor: 'pointer' }}>Sign Up</button>
          </div>
        </form>
        {message && <p style={{ marginTop: '1rem', color: '#4af', fontSize: '0.875rem', textAlign: 'center' }}>{message}</p>}
      </div>
    </main>
  );
}
