'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyLawyer() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [barId, setBarId] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Ontario, Canada');
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a Bar ID photo for AI verification.");
      return;
    }

    setIsScanning(true);
    setScanStatus('Initiating AI visual scan of Bar ID...');
    
    setTimeout(() => setScanStatus('Cross-referencing global legal database...'), 1200);
    setTimeout(() => setScanStatus('Verifying credentials and identity parameters...'), 2500);
    
    setTimeout(() => {
      setScanStatus('Verification Successful. Logging into secure dashboard.');
      localStorage.setItem('lawbridge_lawyer_session', JSON.stringify({
        name: `${firstName} ${lastName}`,
        barId,
        jurisdiction
      }));
      setTimeout(() => router.push('/dashboard/lawyer'), 1000);
    }, 3800);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between p-8">
      <div className="max-w-md mx-auto w-full my-auto bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Restricted Counsel Access</span>
          <h1 className="text-2xl font-bold mt-1">Database Verification</h1>
          <p className="text-xs text-zinc-500 mt-2">AI-powered credential cross-referencing.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">First Name</label>
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Last Name</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Bar Association ID</label>
            <input type="text" required value={barId} onChange={e => setBarId(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Jurisdiction</label>
            <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white">
              <option value="Ontario, Canada">Ontario, Canada</option>
              <option value="California, USA">California, USA</option>
              <option value="New York, USA">New York, USA</option>
            </select>
          </div>
          <div className="border border-zinc-700 bg-zinc-950 p-4 rounded-lg mt-4">
            <label className="block text-xs font-bold text-zinc-300 mb-2 uppercase">Upload Bar ID Photo (Required for AI Scan)</label>
            <input type="file" required onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer" />
          </div>

          {isScanning ? (
            <div className="mt-4 p-4 border border-zinc-600 bg-zinc-800 rounded text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-1 w-full bg-zinc-600 rounded overflow-hidden mb-2">
                  <div className="h-full bg-white w-1/2 animate-[bounce_1s_infinite]"></div>
                </div>
                <p className="text-xs font-bold text-white">{scanStatus}</p>
              </div>
            </div>
          ) : (
            <button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded text-sm transition mt-6 uppercase tracking-wider">
              Initiate AI Verification
            </button>
          )}
        </form>

        <div className="mt-6 text-center"><Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 underline">&larr; Back to Home</Link></div>
      </div>
    </main>
  );
}
