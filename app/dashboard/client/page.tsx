'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const PRACTICE_AREAS = [
  "Corporate & Commercial Law",
  "Mergers & Acquisitions (M&A)",
  "Venture Capital & Private Equity",
  "Family & Matrimonial Law",
  "Criminal Defense & Quasi-Criminal Law",
  "Civil Litigation & Dispute Resolution",
  "Intellectual Property (Patents, Trademarks, Copyrights)",
  "Employment & Labour Law",
  "Real Estate & Property Law",
  "Immigration Law",
  "Tax Law & Wealth Management",
  "Bankruptcy & Insolvency Law",
  "Environmental & Regulatory Law",
  "Administrative & Constitutional Law",
  "Personal Injury & Tort Law",
  "Estate Planning, Wills & Trusts",
  "Technology, Privacy, Cybersecurity & AI Law",
  "Healthcare & Life Sciences Law",
  "Maritime & Admiralty Law",
  "Sports & Entertainment Law",
  "Energy & Natural Resources Law"
];

export default function ClientCommandHub() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('US California');
  const [practiceArea, setPracticeArea] = useState(PRACTICE_AREAS[0]);
  const [urgencyLevel, setUrgencyLevel] = useState('Urgent (48-hour turnaround)');
  const [budgetTier, setBudgetTier] = useState('$10,000 - $25,000');
  const [targetDate, setTargetDate] = useState('');
  const [isExplicit, setIsExplicit] = useState<'Yes' | 'No'>('No');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    let fileUrl = null;
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('matter-attachments')
        .upload(fileName, file);

      if (uploadError) {
        setErrorMsg(`Error uploading file: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('matter-attachments')
        .getPublicUrl(fileName);
      
      fileUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('matters').insert([
      { 
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        company_name: companyName,
        title, 
        location, 
        practice_area: practiceArea, 
        urgency_level: urgencyLevel,
        budget_tier: budgetTier,
        target_resolution_date: targetDate || null,
        description: details, 
        is_explicit: isExplicit === 'Yes',
        attachment_url: fileUrl, 
        status: 'Pending Review' 
      }
    ]);

    setLoading(false);
    if (error) {
      setErrorMsg(`Error submitting to database: ${error.message}`);
    } else {
      setSuccessMsg('Live matter successfully pushed to Supabase database!');
      setTitle('');
      setDetails('');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setCompanyName('');
      setTargetDate('');
      setFile(null);
      setIsExplicit('No');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Submit New Legal Matter</h1>
          <p className="text-gray-400 text-sm">Secure PostgreSQL database intake for clients across US California, US New York, and Ontario, Canada.</p>
        </div>

        {successMsg && <div className="mb-6 p-4 bg-green-950 border border-green-800 text-green-300 rounded-lg text-sm font-medium">{successMsg}</div>}
        {errorMsg && <div className="mb-6 p-4 bg-red-950 border border-red-800 text-red-300 rounded-lg text-sm font-medium">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Extended Client Details (More Boxes) */}
          <div className="p-5 bg-gray-950 border border-gray-800 rounded-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">1. Client Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Name *</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email Address *</label>
                <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white" placeholder="jane@enterprise.com" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Phone Number</label>
                <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white" placeholder="+1 (555) 019-2834" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Company / Entity Name</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white" placeholder="Acme Holdings LLC" />
              </div>
            </div>
          </div>

          {/* Matter Specifics */}
          <div className="p-5 bg-gray-950 border border-gray-800 rounded-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">2. Matter Specifications</h2>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Matter Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white" placeholder="e.g., Series B Global Corporate Restructuring" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Jurisdiction Location *</label>
                <select value={location} onChange={e => setLocation(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white font-semibold">
                  <option value="US California">US California</option>
                  <option value="US New York">US New York</option>
                  <option value="Ontario, Canada">Ontario, Canada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Practice Area *</label>
                <select value={practiceArea} onChange={e => setPracticeArea(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white">
                  {PRACTICE_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Urgency Level</label>
                <select value={urgencyLevel} onChange={e => setUrgencyLevel(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white">
                  <option value="Urgent (48-hour turnaround)">Urgent (48-hr)</option>
                  <option value="Standard (1-2 weeks)">Standard (1-2 wks)</option>
                  <option value="Low Priority / Advisory">Advisory</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Budget Tier</label>
                <select value={budgetTier} onChange={e => setBudgetTier(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white">
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000+">$50,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Target Resolution Date</label>
                <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Detailed Description & Objectives *</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} required rows={4} className="w-full p-3 rounded bg-gray-900 border border-gray-800 text-sm text-white" placeholder="Provide complete context, legal risks, and desired outcome..." />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Attach Supporting Files / Photos</label>
              <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={e => e.target.files && setFile(e.target.files[0])} className="w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-black file:font-bold" />
            </div>

            {/* Explicit Button Toggle */}
            <div className="pt-2 border-t border-gray-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Is this matter Explicit / Sensitive?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsExplicit('Yes')}
                  className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition ${isExplicit === 'Yes' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}
                >
                  Yes (Restricted / Explicit)
                </button>
                <button
                  type="button"
                  onClick={() => setIsExplicit('No')}
                  className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition ${isExplicit === 'No' ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}
                >
                  No (Standard)
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-lg tracking-widest uppercase transition shadow-xl">
            {loading ? 'Pushing to Database...' : 'Submit Matter to Live Database'}
          </button>
        </form>
      </div>
    </div>
  );
}
