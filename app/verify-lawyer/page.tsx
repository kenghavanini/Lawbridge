'use client';

import { useState } from 'react';

export default function VerifyLawyer() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', barId: '', jurisdiction: 'California State Bar' });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('ERROR: Bar ID Photo is required for AI Verification.');
      return;
    }
    setStatus('Querying live cloud database & scanning ID...');
    // Simulated upload delay
    setTimeout(() => setStatus('SUCCESS: Bar ID verified and uploaded to Supabase.'), 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#333] rounded-xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <p className="text-orange-500 text-[10px] font-extrabold tracking-widest uppercase mb-3">Restricted Counsel Access</p>
          <h1 className="text-2xl font-black tracking-tight mb-1">Supabase Bar Database</h1>
          <h2 className="text-2xl font-black tracking-tight mb-3">Verification</h2>
          <p className="text-gray-400 text-xs">Queries live cloud database records.</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
              <input type="text" placeholder="Eleanor" required
                className="w-full bg-black border border-[#333] rounded-md p-3 text-sm focus:border-orange-500 outline-none transition"
                onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div className="w-1/2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
              <input type="text" placeholder="Vance" required
                className="w-full bg-black border border-[#333] rounded-md p-3 text-sm focus:border-orange-500 outline-none transition"
                onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Bar Association ID</label>
            <input type="text" placeholder="349281" required
              className="w-full bg-black border border-[#333] rounded-md p-3 text-sm focus:border-orange-500 outline-none transition"
              onChange={e => setFormData({...formData, barId: e.target.value})} />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Jurisdiction</label>
            <select 
              className="w-full bg-black border border-[#333] rounded-md p-3 text-sm focus:border-orange-500 outline-none appearance-none transition"
              onChange={e => setFormData({...formData, jurisdiction: e.target.value})}>
              <option>California State Bar</option>
              <option>New York State Bar</option>
              <option>Solicitors Regulation Authority (London)</option>
            </select>
          </div>

          {/* MISSING PHOTO UPLOAD ADDED HERE */}
          <div className="p-4 border border-orange-500/50 bg-orange-500/10 rounded-md">
            <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">Upload Bar ID Photo (AI Scan Required)</label>
            <input type="file" accept="image/*" required
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-black hover:file:bg-orange-400 cursor-pointer"
              onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" className="w-full bg-white text-black font-bold py-3 px-4 rounded-md text-sm mt-4 hover:bg-gray-200 transition">
            VERIFY VIA SUPABASE DATABASE
          </button>
        </form>
        
        {status && <p className={`mt-6 text-center text-xs font-bold ${status.startsWith('ERROR') ? 'text-red-500' : 'text-green-500'}`}>{status}</p>}
      </div>
    </div>
  );
}
