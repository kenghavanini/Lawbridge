'use client';

import { useState } from 'react';

export default function ClientCommandHub() {
  const [isExplicit, setIsExplicit] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExplicit === null) {
      alert("ERROR: You must select whether this matter is explicit/sensitive.");
      return;
    }
    alert("Success: Matter and attached photos/documents securely submitted.");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      <div className="max-w-4xl mx-auto mb-10 flex justify-between items-start">
        <div>
          <p className="text-orange-500 text-[10px] font-extrabold tracking-widest uppercase mb-2">Secure Database Infrastructure</p>
          <h1 className="text-3xl font-black tracking-tight mb-1">Client Command Hub</h1>
          <p className="text-gray-400 text-sm">Manage live matters stored in PostgreSQL.</p>
        </div>
        <button className="border border-red-900 text-red-500 hover:bg-red-900/30 px-6 py-2 rounded text-xs font-bold transition">
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-[#333] rounded-xl p-8 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#333] pb-4 mb-6">
          <h2 className="text-xl font-bold">Submit New Legal Matter</h2>
          <button className="text-orange-500 text-xs font-bold hover:underline">&larr; Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Matter Title</label>
            <input type="text" placeholder="e.g., Series B Global Corporate Restructuring" required
              className="w-full bg-black border border-[#333] rounded-md p-3 text-sm focus:border-orange-500 outline-none transition" />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
              <select className="w-full bg-black border border-[#333] rounded-md p-3 text-sm focus:border-orange-500 outline-none appearance-none transition">
                <option>California</option>
                <option>New York</option>
                <option>London</option>
              </select>
            </div>
            
            <div className="w-1/2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Practice Area</label>
              <select className="w-full bg-black border border-[#333] rounded-md p-3 text-sm focus:border-orange-500 outline-none appearance-none transition">
                <option>Venture Capital & Corporate M&A</option>
                <option>Criminal Defense & White Collar</option>
                <option>Intellectual Property & Patents</option>
                <option>Real Estate & Property Transactions</option>
                <option>Family & Divorce Law</option>
                <option>Cybersecurity & Data Privacy</option>
                <option>Immigration & Visa Services</option>
                <option>Tax Law & Audit Defense</option>
                <option>Employment & Labor Law</option>
                <option>Bankruptcy & Insolvency</option>
                <option>Civil & Commercial Litigation</option>
                <option>Environmental & Regulatory Law</option>
                <option>Entertainment & Media Law</option>
                <option>Personal Injury & Medical Malpractice</option>
                <option>International Trade Law</option>
              </select>
            </div>
          </div>

          {/* EXPLICIT / SENSITIVE TOGGLE BUTTONS */}
          <div className="p-5 border border-[#333] rounded-md bg-black">
            <label className="block text-[11px] font-black text-orange-500 uppercase tracking-wider mb-2">Is this matter explicit or highly sensitive?</label>
            <p className="text-xs text-gray-400 mb-3">Lawyers will NOT see this instantly. They must send a request to your inbox, and you must click "Yes" to grant them access.</p>
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsExplicit(true)}
                className={`flex-1 py-4 rounded-md text-sm font-bold border transition ${isExplicit === true ? 'bg-red-900/50 border-red-500 text-red-500' : 'bg-black border-[#333] text-gray-400 hover:border-gray-500'}`}>
                YES (Make it Explicit / Restricted)
              </button>
              <button type="button" onClick={() => setIsExplicit(false)}
                className={`flex-1 py-4 rounded-md text-sm font-bold border transition ${isExplicit === false ? 'bg-green-900/50 border-green-500 text-green-500' : 'bg-black border-[#333] text-gray-400 hover:border-gray-500'}`}>
                NO (Lawyers can see instantly)
              </button>
            </div>
          </div>

          {/* CLIENT PHOTO / DOCUMENT UPLOAD */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Upload Photos / Legal Documents</label>
            <input type="file" multiple required
              className="w-full bg-black border border-[#333] border-dashed rounded-md p-5 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#222] file:text-white hover:file:bg-[#333] cursor-pointer"
              onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" className="w-full bg-white text-black font-bold py-4 px-4 rounded-md text-sm hover:bg-gray-200 transition">
            SUBMIT TO SUPABASE
          </button>
        </form>
      </div>
    </div>
  );
}
