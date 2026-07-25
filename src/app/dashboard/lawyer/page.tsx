'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LawyerDashboard() {
  const router = useRouter();
  const [lawyer, setLawyer] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    const session = localStorage.getItem('lawbridge_lawyer_session');
    if (session) {
      const parsed = JSON.parse(session);
      setLawyer(parsed);
      loadLiveDatabase();
    } else {
      router.push('/verify-lawyer');
    }
  }, [router]);

  const loadLiveDatabase = async () => {
    const [casesRes, inquiriesRes] = await Promise.all([
      supabase.from('cases').select('*').order('created_at', { ascending: false }),
      supabase.from('inquiries').select('*')
    ]);
    if (casesRes.data) setCases(casesRes.data);
    if (inquiriesRes.data) setInquiries(inquiriesRes.data);
  };

  const handleRequestAccess = async (clientEmail: string) => {
    await supabase.from('inquiries').insert([{
      client_email: clientEmail,
      lawyer_name: lawyer.name,
      lawyer_jurisdiction: lawyer.jurisdiction,
      status: 'Pending Review'
    }]);
    
    alert('Access request dispatched to client inbox securely.');
    loadLiveDatabase();
  };

  const checkAccess = (clientEmail: string) => {
    return inquiries.some(inq => inq.client_email === clientEmail && inq.lawyer_name === lawyer.name && inq.status === 'Authorized');
  };

  const handleSignOut = () => {
    localStorage.removeItem('lawbridge_lawyer_session');
    router.push('/verify-lawyer');
  };

  if (!lawyer) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between p-8 sm:p-12">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest hidden sm:block">Verified Legal Counsel Hub</div>
          <span className="text-xs text-zinc-300 font-bold">{lawyer.name} &bull; {lawyer.jurisdiction}</span>
          <button onClick={handleSignOut} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 rounded transition">Disconnect</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full my-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Global Database</span>
          <h1 className="text-3xl font-black mt-1">Active Client Matters</h1>
        </div>

        <div className="space-y-4">
          {cases.length === 0 ? <p className="text-sm text-zinc-500 italic">No client matters found in the database.</p> : cases.map((c: any) => {
            const hasAccess = checkAccess(c.email);
            const pendingAccess = inquiries.some(inq => inq.client_email === c.email && inq.lawyer_name === lawyer.name && inq.status === 'Pending Review');

            return (
              <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold">{c.first_name} {c.last_name}</h2>
                      <p className="text-xs text-zinc-400">{c.case_location} &bull; Urgency: <span className="text-white font-semibold">{c.urgency_level}</span> &bull; Posted: {new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded p-3 text-sm">
                    <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">Matter Description</span>
                    {c.is_description_explicit && !hasAccess ? <span className="text-zinc-500 italic">[EXPLICIT DATA RESTRICTED - REQUEST ACCESS]</span> : c.matter_description}
                  </div>
                  
                  <div className="bg-black border border-zinc-800 rounded p-3 text-sm">
                    <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">Budget Allocation</span>
                    {c.is_budget_explicit && !hasAccess ? <span className="text-zinc-500 italic">[EXPLICIT DATA RESTRICTED - REQUEST ACCESS]</span> : c.budget}
                  </div>
                </div>

                <div className="w-full md:w-64 flex flex-col justify-center items-center bg-black border border-zinc-800 rounded-lg p-4 text-center">
                  {hasAccess ? (
                    <div className="text-zinc-300 font-bold text-sm">
                      <span className="block text-xl mb-1">🔓</span> Authorized Access Granted
                      <div className="mt-2 text-xs font-normal text-zinc-400 break-all">{c.email}<br/>{c.phone_number}</div>
                    </div>
                  ) : pendingAccess ? (
                    <div className="text-zinc-500 font-bold text-sm uppercase tracking-wider">Request Pending...</div>
                  ) : (
                    <>
                      <p className="text-xs text-zinc-400 mb-3">Explicit details are protected by client authorization.</p>
                      <button onClick={() => handleRequestAccess(c.email)} className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-2.5 rounded text-xs transition">
                        Request Access to Explicit Data
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center"><Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 underline">&larr; Return to Home</Link></div>
      </div>
    </main>
  );
}
