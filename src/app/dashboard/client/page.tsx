'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ClientCommandHub() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [caseLocation, setCaseLocation] = useState('Ontario, Canada');
  const [urgencyLevel, setUrgencyLevel] = useState('Medium');
  const [budget, setBudget] = useState('');
  const [matterDescription, setMatterDescription] = useState('');
  
  const [isBudgetExplicit, setIsBudgetExplicit] = useState(true);
  const [isDescriptionExplicit, setIsDescriptionExplicit] = useState(true);

  const [statusMessage, setStatusMessage] = useState('');
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('lawbridge_user_email');
    if (savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
      loadClientData(savedEmail);
      loadInquiries(savedEmail);
    } else {
      router.push('/login');
    }
  }, [router]);

  const loadClientData = async (email: string) => {
    const { data, error } = await supabase.from('cases').select('*').eq('email', email).single();
    if (data) {
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setPhoneNumber(data.phone_number || '');
      setCaseLocation(data.case_location || 'Ontario, Canada');
      setUrgencyLevel(data.urgency_level || 'Medium');
      setBudget(data.budget || '');
      setMatterDescription(data.matter_description || '');
      setIsBudgetExplicit(data.is_budget_explicit ?? true);
      setIsDescriptionExplicit(data.is_description_explicit ?? true);
    }
  };

  const loadInquiries = async (email: string) => {
    const { data, error } = await supabase.from('inquiries').select('*').eq('client_email', email);
    if (data) setInquiries(data);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('cases')
      .upsert({
        email: userEmail,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        case_location: caseLocation,
        urgency_level: urgencyLevel,
        budget: budget,
        is_budget_explicit: isBudgetExplicit,
        matter_description: matterDescription,
        is_description_explicit: isDescriptionExplicit
      }, { onConflict: 'email' });

    if (error) {
      setStatusMessage('Error publishing case: ' + error.message);
    } else {
      setStatusMessage('Case published securely to the live Lawyer Database.');
    }
  };

  const handleAuthorization = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id);
    loadInquiries(userEmail);
  };

  const handleSignOut = () => {
    localStorage.removeItem('lawbridge_user_email');
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between p-8 sm:p-12">
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest hidden sm:block">Secure Legal Infrastructure</div>
          <span className="text-xs text-zinc-300">{userEmail}</span>
          <button onClick={handleSignOut} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 rounded transition">Sign Out</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full my-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Client Portal</span>
          <h1 className="text-3xl font-black mt-1">Client Command Hub</h1>
        </div>

        {statusMessage && <div className="p-4 bg-zinc-900 border border-zinc-700 text-white text-xs rounded">{statusMessage}</div>}

        <form onSubmit={handleSaveAll} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-zinc-400 mb-1">First Name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white" /></div>
            <div><label className="block text-xs font-semibold text-zinc-400 mb-1">Last Name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white" /></div>
            <div><label className="block text-xs font-semibold text-zinc-400 mb-1">Phone Number</label><input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white" /></div>
          </div>
          
          <hr className="border-zinc-800" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Case Jurisdiction</label>
              <select value={caseLocation} onChange={e => setCaseLocation(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white">
                <option value="Ontario, Canada">Ontario, Canada</option>
                <option value="California, USA">California, USA</option>
                <option value="New York, USA">New York, USA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Urgency Level</label>
              <select value={urgencyLevel} onChange={e => setUrgencyLevel(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white">
                <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Budget / Compensation ($)</label>
              <input type="text" value={budget} onChange={e => setBudget(e.target.value)} required className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white mb-2" />
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={isBudgetExplicit} onChange={e => setIsBudgetExplicit(e.target.checked)} className="accent-white" />
                Mark as Explicit (Hide until lawyer is authorized)
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Description of the Matter</label>
              <textarea value={matterDescription} onChange={e => setMatterDescription(e.target.value)} rows={4} required className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white mb-2" />
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={isDescriptionExplicit} onChange={e => setIsDescriptionExplicit(e.target.checked)} className="accent-white" />
                Mark as Explicit (Hide until lawyer is authorized)
              </label>
            </div>
          </div>
          <button type="submit" className="mt-6 bg-white hover:bg-zinc-200 text-black font-bold px-5 py-2.5 rounded text-xs transition">Save & Publish to Live Database</button>
        </form>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-1">Lawyer Inquiries Inbox</h2>
          <p className="text-xs text-zinc-400 mb-4">Review and authorize real incoming requests from verifying lawyers.</p>
          <div className="space-y-3">
            {inquiries.length === 0 ? <p className="text-xs text-zinc-500 italic">No inquiries yet. Publish a case to appear in the database.</p> : inquiries.map(inq => (
              <div key={inq.id} className="bg-black border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{inq.lawyer_name}</h3>
                  <p className="text-xs text-zinc-400">Jurisdiction: {inq.lawyer_jurisdiction} &bull; Requested on {new Date(inq.created_at).toLocaleDateString()}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-white">Status: {inq.status}</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {inq.status === 'Pending Review' ? (
                    <>
                      <button onClick={() => handleAuthorization(inq.id, 'Authorized')} className="flex-1 sm:flex-none bg-white hover:bg-zinc-200 text-black font-bold px-3 py-1.5 rounded text-xs transition">Authorize Access</button>
                      <button onClick={() => handleAuthorization(inq.id, 'Denied')} className="flex-1 sm:flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-3 py-1.5 rounded text-xs transition">Deny</button>
                    </>
                  ) : <span className="text-xs text-zinc-500 font-semibold italic">Action Completed</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center"><Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 underline">&larr; Return to Home</Link></div>
      </div>
    </main>
  );
}
