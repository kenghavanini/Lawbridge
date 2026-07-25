'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';

export default function LawyerDashboardPage() {
  const [viewMode, setViewMode] = useState<'dark' | 'light' | 'terminal'>('terminal');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [barId, setBarId] = useState('');
  const [jurisdiction, setJurisdiction] = useState('California State Bar');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  const [clientMatters, setClientMatters] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'matters' | 'inbox'>('matters');

  useEffect(() => {
    if (isLoggedIn) {
      fetchLiveMatters();
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchLiveMatters = async () => {
    const { data, error } = await supabase.from('matters').select('*').order('created_at', { ascending: false });
    if (!error && data) setClientMatters(data);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (!error && data) setMessages(data);
  };

  const handleRegistryVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/verify-lawyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, barId, jurisdiction }),
      });

      const data = await response.json();
      setVerifying(false);

      if (!response.ok || !data.verified) {
        setError(data.error || 'Supabase database verification failed.');
        return;
      }

      setIsLoggedIn(true);
    } catch (err) {
      setVerifying(false);
      setError('Failed to connect to Supabase database.');
    }
  };

  const sendLawyerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage) return;
    const { error } = await supabase.from('messages').insert([
      { sender: `Counsel (${firstName} ${lastName}, ${jurisdiction})`, text: newMessage }
    ]);
    if (!error) {
      setNewMessage('');
      fetchMessages();
    }
  };

  const cycleTheme = () => {
    if (viewMode === 'terminal') setViewMode('dark');
    else if (viewMode === 'dark') setViewMode('light');
    else setViewMode('terminal');
  };

  // Theme styling dictionaries
  const bgClass = viewMode === 'terminal' ? 'bg-zinc-950 text-green-400 font-mono' : viewMode === 'dark' ? 'bg-black text-white' : 'bg-white text-zinc-900';
  const borderClass = viewMode === 'terminal' ? 'border-green-800 bg-black/80' : viewMode === 'dark' ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-300 bg-zinc-50';
  const headerBorder = viewMode === 'terminal' ? 'border-green-900' : viewMode === 'dark' ? 'border-zinc-800' : 'border-zinc-200';
  const accentColor = viewMode === 'terminal' ? 'text-green-400' : 'text-amber-500';

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${bgClass}`}>
      <div>
        <header className={`max-w-7xl mx-auto px-8 py-6 flex justify-between items-center border-b ${headerBorder}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">⚖️</span>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Link href="/" className={viewMode === 'terminal' ? 'text-green-400 hover:underline' : 'hover:opacity-80'}>LawBridge</Link>
              <span className="opacity-50">/</span>
              <span className="opacity-80">Lawyer Terminal / Registry</span>
            </div>
          </div>
          <Link href="/client" className="text-xs hover:underline opacity-80">Client Portal</Link>
        </header>

        {!isLoggedIn ? (
          <div className="max-w-xl mx-auto mt-16 px-4">
            <div className={`border p-8 rounded-xl space-y-6 shadow-2xl ${borderClass}`}>
              <div className="space-y-2 text-center">
                <p className={`text-xs font-bold tracking-widest uppercase ${accentColor}`}>
                  {viewMode === 'terminal' ? '[$] LAWBRIDGE_CLI v2.6.4 — SECURE TERMINAL MODE' : 'SUPABASE BAR DATABASE VERIFICATION'}
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight">State Bar Database Query</h2>
                <p className="text-xs opacity-70">Queries live cloud PostgreSQL database records.</p>
              </div>

              {error && <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded">{error}</div>}

              <form onSubmit={handleRegistryVerification} className="space-y-4 text-left max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">FIRST NAME</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Eleanor" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${viewMode === 'terminal' ? 'bg-black border-green-800 text-green-300 font-mono' : viewMode === 'dark' ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">LAST NAME</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Vance" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${viewMode === 'terminal' ? 'bg-black border-green-800 text-green-300 font-mono' : viewMode === 'dark' ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">BAR ASSOCIATION ID</label>
                  <input type="text" value={barId} onChange={(e) => setBarId(e.target.value)} placeholder="349281" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none font-mono ${viewMode === 'terminal' ? 'bg-black border-green-800 text-green-300' : viewMode === 'dark' ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">JURISDICTION</label>
                  <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${viewMode === 'terminal' ? 'bg-black border-green-800 text-green-300 font-mono' : viewMode === 'dark' ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}>
                    <option>California State Bar</option>
                    <option>New York State Bar</option>
                    <option>Law Society of Ontario</option>
                  </select>
                </div>
                <button type="submit" disabled={verifying} className={`w-full py-3.5 font-bold rounded text-xs tracking-wider uppercase transition-colors ${viewMode === 'terminal' ? 'bg-green-500 text-black hover:bg-green-400 font-mono' : viewMode === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
                  {verifying ? 'QUERYING SUPABASE REGISTRY...' : 'VERIFY VIA SUPABASE DATABASE'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
            <div className={`flex justify-between items-center border p-6 rounded-xl ${borderClass}`}>
              <div>
                <h2 className="text-xl font-bold">Lawyer Command Center {viewMode === 'terminal' && '[TERMINAL MODE ACTIVE]'}</h2>
                <p className="text-xs mt-1 opacity-80">Verified Counsel: <span className={`font-bold ${accentColor}`}>{firstName} {lastName}</span> ({jurisdiction})</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('matters')} className={`px-4 py-2 text-xs font-bold rounded ${activeTab === 'matters' ? (viewMode === 'terminal' ? 'bg-green-500 text-black' : 'bg-amber-500 text-black') : 'opacity-60 bg-zinc-800 text-white'}`}>Matter Queue</button>
                  <button onClick={() => setActiveTab('inbox')} className={`px-4 py-2 text-xs font-bold rounded ${activeTab === 'inbox' ? (viewMode === 'terminal' ? 'bg-green-500 text-black' : 'bg-amber-500 text-black') : 'opacity-60 bg-zinc-800 text-white'}`}>Secure Inbox</button>
                </div>
                <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 text-xs font-medium rounded bg-red-950 text-red-300 border border-red-800">Sign Out</button>
              </div>
            </div>

            {activeTab === 'matters' ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Live Database Matter Queue</h3>
                <div className="space-y-4">
                  {clientMatters.length === 0 ? (
                    <p className="text-xs opacity-50 italic py-12 text-center">No active matters in database.</p>
                  ) : (
                    clientMatters.map((m) => (
                      <div key={m.id} className={`border p-6 rounded-xl space-y-4 ${borderClass}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-lg">{m.title}</h4>
                            <p className="text-xs opacity-70">Client: <span className={`font-mono ${accentColor}`}>{m.client_email}</span> • {m.area}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-mono rounded ${m.lawyer_permission_granted ? 'bg-green-950 text-green-300 border border-green-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                            {m.lawyer_permission_granted ? 'Access Granted' : 'Encrypted (Requires Client Permission)'}
                          </span>
                        </div>

                        {/* Granular Field Visibility Display */}
                        <div className={`p-4 rounded border text-xs font-mono space-y-2 ${viewMode === 'terminal' ? 'bg-black border-green-900 text-green-300' : viewMode === 'dark' ? 'bg-black border-zinc-800 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-800'}`}>
                          <p className={`font-bold uppercase ${accentColor}`}>Matter Financial & Scope Disclosure:</p>
                          
                          {!m.lawyer_permission_granted ? (
                            <p className="italic opacity-60">🔒 [Encrypted] Full matter scope and budget are hidden until general client permission is granted.</p>
                          ) : (
                            <div className="space-y-2">
                              <div>
                                <span className="opacity-60 font-bold">Budget: </span>
                                {m.hide_budget ? <span className="italic text-amber-400">🔒 [Hidden by Client Explicit Privacy Toggle]</span> : <span>{m.budget}</span>}
                              </div>
                              <div>
                                <span className="opacity-60 font-bold">Details: </span>
                                {m.hide_details ? <span className="italic text-amber-400">🔒 [Hidden by Client Explicit Privacy Toggle]</span> : <span>{m.details}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className={`max-w-3xl mx-auto border p-8 rounded-xl space-y-6 ${borderClass}`}>
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="text-2xl font-bold">Counsel Secure Inbox</h3>
                    <p className="text-xs opacity-70">Direct two-way encrypted messaging thread with clients.</p>
                  </div>
                </div>
                <div className={`border rounded-lg p-4 h-72 overflow-y-auto space-y-3 font-mono text-xs ${viewMode === 'terminal' ? 'bg-black border-green-900' : viewMode === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-300'}`}>
                  {messages.map((msg, idx) => (
                    <div key={idx} className="p-2.5 border-b border-zinc-800/50 space-y-1">
                      <div className="flex justify-between opacity-60">
                        <span className={`font-bold ${msg.sender.includes('Counsel') ? 'text-green-400' : accentColor}`}>{msg.sender}</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="opacity-90">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendLawyerMessage} className="flex gap-2">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type reply message to client..." className={`flex-1 border rounded px-3 py-2.5 text-sm focus:outline-none ${viewMode === 'terminal' ? 'bg-black border-green-800 text-green-300 font-mono' : viewMode === 'dark' ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  <button type="submit" className={`px-6 py-2.5 font-bold rounded text-xs ${viewMode === 'terminal' ? 'bg-green-500 text-black hover:bg-green-400 font-mono' : 'bg-white text-black hover:bg-zinc-200'}`}>Send Reply</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      <footer className={`max-w-7xl mx-auto w-full px-8 py-6 flex justify-between items-center text-xs border-t ${headerBorder}`}>
        <button onClick={cycleTheme} className={`px-3 py-1.5 rounded font-bold text-xs ${viewMode === 'terminal' ? 'bg-green-500 text-black font-mono' : 'bg-white text-black'}`}>
          Toggle Theme: {viewMode.toUpperCase()} Mode
        </button>
        <p>© 2026 LawBridge Systems.</p>
      </footer>
    </div>
  );
}
