'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LawyerVerificationPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [barId, setBarId] = useState('');
  const [jurisdiction, setJurisdiction] = useState('US California');
  const [barCardFile, setBarCardFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barCardFile) {
      setErrorMsg('CRITICAL ERROR: You must upload a photo or scan of your official Bar Card / ID.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const fileName = `bar-card-${Date.now()}-${barCardFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('matter-attachments')
        .upload(fileName, barCardFile);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from('matter-attachments')
        .getPublicUrl(fileName);

      const barCardImageUrl = publicUrlData.publicUrl;

      const res = await fetch('/api/verify-lawyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, barId, jurisdiction, barCardImageUrl })
      });

      const data = await res.json();
      if (!res.ok || !data.verified) {
        throw new Error(data.error || 'AI Verification failed.');
      }

      setSuccessMsg('AI Vision Verification Successful! Synced to database. Redirecting...');
      setTimeout(() => router.push('/dashboard/lawyer'), 1500);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-gray-950 border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Zero-Trust Security</span>
          <h1 className="text-2xl font-bold text-white mt-1">Lawyer Bar Verification</h1>
          <p className="text-xs text-gray-400 mt-1">Enter Bar ID and upload credentials for AI audit.</p>
        </div>

        {successMsg && <div className="mb-4 p-3 bg-green-950 border border-green-800 text-green-300 text-sm rounded text-center">{successMsg}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-300 text-sm rounded text-center">{errorMsg}</div>}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-white text-sm" placeholder="Sarah" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Last Name</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-white text-sm" placeholder="Jenkins" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Bar Association ID (Required)</label>
            <input type="text" value={barId} onChange={e => setBarId(e.target.value)} required className="w-full p-3 rounded bg-gray-900 border border-amber-600/60 text-white text-sm font-mono" placeholder="e.g., CA-123456, NY-987654, LSO-849201" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Jurisdiction</label>
            <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-white text-sm">
              <option value="US California">US California</option>
              <option value="US New York">US New York</option>
              <option value="Ontario, Canada">Ontario, Canada</option>
            </select>
          </div>

          <div className="p-4 bg-gray-900 border-2 border-dashed border-amber-500/50 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Upload Bar ID Card Photo / Scan <span className="text-red-400">*Required</span></label>
            <p className="text-[11px] text-gray-400 mb-3">AI Vision will verify image pixels against official registry records.</p>
            <input type="file" accept="image/*,.pdf" onChange={e => e.target.files && setBarCardFile(e.target.files[0])} required className="w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-black file:font-bold" />
            {barCardFile && <p className="text-xs text-green-400 mt-2 font-medium">Selected: {barCardFile.name}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded tracking-widest uppercase text-xs transition shadow-lg mt-2">
            {loading ? 'Running AI Vision Audit...' : 'Verify & Sync to Database'}
          </button>
        </form>
      </div>
    </div>
  );
}
