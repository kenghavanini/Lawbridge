'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ClientPortal() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'hub' | 'submit' | 'pathway' | 'inbox'>('hub');

  const [matterTitle, setMatterTitle] = useState('');
  const [location, setLocation] = useState('us USA - California - San Francisco');
  const [practiceArea, setPracticeArea] = useState('Venture Capital & Corporate M&A');
  const [urgency, setUrgency] = useState('Urgent (48-hour turnaround)');
  const [budget, setBudget] = useState('$10,000 - $25,000');
  const [details, setDetails] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [matters, setMatters] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setLoggedInEmail(session.user.email || null);
        setUserId(session.user.id);
        fetchMatters(session.user.id);
      }
    });
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMatters = async (uid: string) => {
    const { data, error } = await supabase.from('matters').select('*').eq('client_id', uid).order('created_at', { ascending: false });
    if (!error && data) setMatters(data);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (!error && data) setMessages(data);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); return; }
    setSuccessMsg('Account created successfully! You can now log in.');
    setAuthMode('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    if (data.user) {
      setLoggedInEmail(data.user.email || null);
      setUserId(data.user.id);
      fetchMatters(data.user.id);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLoggedInEmail(null);
    setUserId(null);
    setMatters([]);
  };

  const handleMatterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const { error } = await supabase.from('matters').insert([
      { client_id: userId, client_email: loggedInEmail, title: matterTitle, location, area: practiceArea, urgency, budget, details, status: 'Live in Database - Awaiting Counsel', lawyer_permission_granted: false }
    ]);
    if (error) {
      setError(error.message);
    } else {
      setSubmitSuccess(true);
      fetchMatters(userId);
      setTimeout(() => { setSubmitSuccess(false); setActiveTab('hub'); setMatterTitle(''); setDetails(''); }, 2000);
    }
  };

  const togglePermission = async (id: string, currentState: boolean) => {
    const nextState = !currentState;
    const { error } = await supabase.from('matters').update({ lawyer_permission_granted: nextState, status: nextState ? 'Active - Permission Granted to Counsel' : 'Permission Revoked' }).eq('id', id);
    if (!error && userId) fetchMatters(userId);
  };

  const sendInboxMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage) return;
    const { error } = await supabase.from('messages').insert([
      { sender: `Client (${loggedInEmail})`, text: newMessage }
    ]);
    if (!error) { setNewMessage(''); fetchMessages(); }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      <div>
        <header className={`max-w-7xl mx-auto px-8 py-6 flex justify-between items-center border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">⚖️</span>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Link href="/" className={isDarkMode ? 'text-white hover:text-zinc-300' : 'text-zinc-900 hover:text-zinc-600'}>LawBridge</Link>
              <span className={isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}>/</span>
              <span className={isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}>Client Command Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            {loggedInEmail && <span className="text-xs font-mono text-amber-500">Cloud Session: {loggedInEmail}</span>}
            <Link href="/lawyer" className={isDarkMode ? 'text-zinc-400 hover:text-white transition-colors' : 'text-zinc-600 hover:text-zinc-900 transition-colors'}>Lawyer Portal</Link>
          </div>
        </header>

        {!loggedInEmail ? (
          <div className="max-w-xl mx-auto mt-20 px-4">
            <div className={`border p-8 rounded-xl space-y-6 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'}`}>
              <div className="flex border-b border-zinc-800 pb-4">
                <button onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }} className={`flex-1 pb-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${authMode === 'login' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500'}`}>Client Login</button>
                <button onClick={() => { setAuthMode('signup'); setError(''); setSuccessMsg(''); }} className={`flex-1 pb-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${authMode === 'signup' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500'}`}>Client Sign Up</button>
              </div>
              {error && <div className="p-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded">{error}</div>}
              {successMsg && <div className="p-3 bg-green-950 border border-green-800 text-green-300 text-xs rounded">{successMsg}</div>}
              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>EMAIL</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@company.com" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none font-mono ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>PASSWORD</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                  <button type="submit" className={`w-full py-3.5 font-semibold rounded text-sm transition-colors ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>Log In via Supabase</button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>NEW CLIENT EMAIL</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="newclient@company.com" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none font-mono ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>CREATE PASSWORD</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                  <button type="submit" className={`w-full py-3.5 font-semibold rounded text-sm transition-colors ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>Register Live Client Account</button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-500">SECURE DATABASE INFRASTRUCTURE</p>
                <h1 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Client Command Hub</h1>
                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Manage live matters stored in PostgreSQL.</p>
              </div>
              <button onClick={handleSignOut} className="px-4 py-2 bg-red-950 border border-red-800 text-red-300 text-xs rounded hover:bg-red-900">Sign Out</button>
            </div>

            {activeTab === 'hub' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setActiveTab('submit')} className={`border p-6 rounded-xl cursor-pointer transition-all hover:border-amber-500/50 space-y-3 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'}`}>
                  <div className="flex justify-between items-center"><h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Submit New Matter</h3><span className="text-amber-500">→</span></div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Push new legal matters directly to Supabase.</p>
                </div>
                <div onClick={() => setActiveTab('pathway')} className={`border p-6 rounded-xl cursor-pointer transition-all hover:border-amber-500/50 space-y-3 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'}`}>
                  <div className="flex justify-between items-center"><h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Matter Pathway ({matters.length})</h3><span className="text-amber-500">→</span></div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Control lawyer access permissions live.</p>
                </div>
                <div onClick={() => setActiveTab('inbox')} className={`border p-6 rounded-xl cursor-pointer transition-all hover:border-amber-500/50 space-y-3 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'}`}>
                  <div className="flex justify-between items-center"><h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Secure Inbox</h3><span className="text-amber-500">→</span></div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Direct encrypted messaging threads with verified legal counsel.</p>
                </div>
              </div>
            )}

            {activeTab === 'submit' && (
              <div className={`max-w-3xl mx-auto border p-8 rounded-xl space-y-6 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Submit New Legal Matter</h2>
                  <button onClick={() => setActiveTab('hub')} className="text-xs text-amber-500 hover:underline">← Back</button>
                </div>
                {submitSuccess && <div className="p-3 bg-green-950 border border-green-800 text-green-300 text-xs rounded">Matter pushed to Supabase database!</div>}
                <form onSubmit={handleMatterSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>MATTER TITLE</label>
                    <input type="text" value={matterTitle} onChange={(e) => setMatterTitle(e.target.value)} placeholder="e.g., Series B Global Corporate Restructuring" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>LOCATION</label>
                      <select value={location} onChange={(e) => setLocation(e.target.value)} className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}>
                        <option>us USA - California - San Francisco</option>
                        <option>us USA - New York - New York City</option>
                        <option>uk United Kingdom - England - London</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>PRACTICE AREA</label>
                      <select value={practiceArea} onChange={(e) => setPracticeArea(e.target.value)} className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}>
                        <option>Venture Capital & Corporate M&A</option>
                        <option>Intellectual Property & Licensing</option>
                        <option>Cross-Border Litigation</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>MATTER DETAILS</label>
                    <textarea rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe legal scope..." className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-white text-black font-bold rounded text-sm hover:bg-zinc-200">SUBMIT TO SUPABASE</button>
                </form>
              </div>
            )}

            {activeTab === 'pathway' && (
              <div className={`max-w-3xl mx-auto border p-8 rounded-xl space-y-6 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Matter Pathway</h2>
                  <button onClick={() => setActiveTab('hub')} className="text-xs text-amber-500 hover:underline">← Back</button>
                </div>
                <div className="space-y-4">
                  {matters.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic py-8 text-center">No matters submitted yet.</p>
                  ) : (
                    matters.map((m) => (
                      <div key={m.id} className={`border p-6 rounded-lg space-y-4 ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-300'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{m.title}</h3>
                            <p className="text-xs text-zinc-500">{m.area} • {m.location}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-mono rounded ${m.lawyer_permission_granted ? 'bg-green-950 text-green-300 border border-green-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                            {m.status}
                          </span>
                        </div>
                        <div className={`p-4 rounded border flex justify-between items-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                          <p className="text-xs font-bold">Grant Counsel Permission</p>
                          <button onClick={() => togglePermission(m.id, m.lawyer_permission_granted)} className={`px-4 py-2 text-xs font-bold rounded ${m.lawyer_permission_granted ? 'bg-red-900 text-white' : 'bg-white text-black'}`}>
                            {m.lawyer_permission_granted ? 'Revoke Permission' : 'Grant Permission'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'inbox' && (
              <div className={`max-w-3xl mx-auto border p-8 rounded-xl space-y-6 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Secure Inbox</h2>
                    <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Direct encrypted messaging threads with verified legal counsel.</p>
                  </div>
                  <button onClick={() => setActiveTab('hub')} className="text-xs text-amber-500 hover:underline">← Back to Dashboard</button>
                </div>
                <div className={`border rounded-lg p-4 h-72 overflow-y-auto space-y-3 font-mono text-xs ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-300'}`}>
                  {messages.map((msg, idx) => (
                    <div key={idx} className="p-2.5 border-b border-zinc-800/50 space-y-1">
                      <div className="flex justify-between text-zinc-500">
                        <span className={`font-bold ${msg.sender.includes('Counsel') ? 'text-green-400' : 'text-amber-500'}`}>{msg.sender}</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-zinc-200">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendInboxMessage} className="flex gap-2">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type encrypted message to counsel..." className={`flex-1 border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  <button type="submit" className="px-6 py-2.5 bg-white text-black font-bold rounded text-xs hover:bg-zinc-200">Send</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      <footer className={`max-w-7xl mx-auto w-full px-8 py-6 flex justify-between items-center text-xs border-t ${isDarkMode ? 'border-zinc-900 text-zinc-500' : 'border-zinc-200 text-zinc-400'}`}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="px-3 py-1.5 rounded font-medium text-xs bg-white text-black">Toggle Theme</button>
        <p>© 2026 LawBridge Systems.</p>
      </footer>
    </div>
  );
}
