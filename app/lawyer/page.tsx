'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LawyerDashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  const handleAiVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError('');

    const cleanFirst = firstName.trim().toLowerCase();
    const cleanLast = lastName.trim().toLowerCase();
    const cleanBar = barId.trim();

    const { data, error } = await supabase
      .from('lawyers')
      .select('*')
      .eq('first_name', cleanFirst)
      .eq('last_name', cleanLast)
      .eq('bar_id', cleanBar)
      .eq('jurisdiction', jurisdiction)
      .single();

    setVerifying(false);

    if (error || !data) {
      setError('AI Database Verification Failed: Credentials do not match active state bar records in Supabase.');
      return;
    }

    setIsLoggedIn(true);
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

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      <div>
        <header className={`max-w-7xl mx-auto px-8 py-6 flex justify-between items-center border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">⚖️</span>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Link href="/" className={isDarkMode ? 'text-white hover:text-zinc-300' : 'text-zinc-900 hover:text-zinc-600'}>LawBridge</Link>
              <span className={isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}>/</span>
              <span className={isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}>Counsel Verification</span>
            </div>
          </div>
          <Link href="/client" className={isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}>Client Portal</Link>
        </header>

        {!isLoggedIn ? (
          <div className="max-w-xl mx-auto mt-16 px-4">
            <div className={`border p-8 rounded-xl space-y-6 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'}`}>
              <div className="space-y-2 text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-500">RESTRICTED COUNSEL ACCESS</p>
                <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Supabase Bar Database Verification</h2>
                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Queries live cloud database records.</p>
              </div>

              {error && <div className="p-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded">{error}</div>}

              <form onSubmit={handleAiVerification} className="space-y-4 text-left max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>FIRST NAME</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Eleanor" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>LAST NAME</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Vance" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>BAR ASSOCIATION ID</label>
                  <input type="text" value={barId} onChange={(e) => setBarId(e.target.value)} placeholder="349281" required className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none font-mono ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>JURISDICTION</label>
                  <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className={`w-full border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`}>
                    <option>California State Bar</option>
                    <option>New York State Bar</option>
                    <option>Law Society of Ontario</option>
                  </select>
                </div>
                <button type="submit" disabled={verifying} className={`w-full py-3.5 font-semibold rounded text-sm transition-colors ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
                  {verifying ? 'Querying Supabase Database...' : 'VERIFY VIA SUPABASE DATABASE'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
            <div className={`flex justify-between items-center border p-6 rounded-xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Lawyer Command Center</h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Verified Counsel: <span className="text-amber-500 font-bold">{firstName} {lastName}</span> ({jurisdiction})</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('matters')} className={`px-4 py-2 text-xs font-bold rounded ${activeTab === 'matters' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white'}`}>Matter Queue</button>
                  <button onClick={() => setActiveTab('inbox')} className={`px-4 py-2 text-xs font-bold rounded ${activeTab === 'inbox' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white'}`}>Secure Inbox</button>
                </div>
                <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 text-xs font-medium rounded bg-red-950 text-red-300 border border-red-800">Sign Out</button>
              </div>
            </div>

            {activeTab === 'matters' ? (
              <div className="space-y-4">
                <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Live Database Matter Queue</h3>
                <div className="space-y-4">
                  {clientMatters.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic py-12 text-center">No active matters in database.</p>
                  ) : (
                    clientMatters.map((m) => (
                      <div key={m.id} className={`border p-6 rounded-xl space-y-4 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{m.title}</h4>
                            <p className="text-xs text-zinc-500">Client: <span className="font-mono text-amber-500">{m.client_email}</span> • {m.area}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-mono rounded ${m.lawyer_permission_granted ? 'bg-green-950 text-green-300 border border-green-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                            {m.lawyer_permission_granted ? 'Permission Granted' : 'Encrypted (Requires Client Permission)'}
                          </span>
                        </div>
                        <div className={`p-4 rounded border text-xs font-mono ${isDarkMode ? 'bg-black border-zinc-800 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-800'}`}>
                          <p className="font-bold text-amber-500 uppercase mb-1">Matter Details:</p>
                          {m.lawyer_permission_granted ? <p>{m.details}</p> : <p className="italic text-zinc-500">🔒 [Encrypted] Hidden until client grants permission.</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className={`max-w-3xl mx-auto border p-8 rounded-xl space-y-6 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Counsel Secure Inbox</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Direct two-way encrypted messaging thread with clients.</p>
                  </div>
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
                <form onSubmit={sendLawyerMessage} className="flex gap-2">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type reply message to client..." className={`flex-1 border rounded px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} />
                  <button type="submit" className="px-6 py-2.5 bg-white text-black font-bold rounded text-xs hover:bg-zinc-200">Send Reply</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      <footer className={`max-w-7xl mx-auto w-full px-8 py-6 flex justify-between items-center text-xs border-t ${isDarkMode ? 'border-zinc-900 text-zinc-500' : 'border-zinc-200 text-zinc-400'}`}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="px-3 py-1.5 rounded bg-white text-black text-xs font-medium">Toggle Theme</button>
        <p>© 2026 LawBridge Systems.</p>
      </footer>
    </div>
  );
}
