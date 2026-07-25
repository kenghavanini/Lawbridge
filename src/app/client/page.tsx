'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ClientCommandHub() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('US - California - Los Angeles');
  const [practiceArea, setPracticeArea] = useState('Venture Capital & Corporate M&A');
  const [urgencyLevel, setUrgencyLevel] = useState('Urgent (48-hour turnaround)');
  const [budgetTier, setBudgetTier] = useState('$10,000 - $25,000');
  const [details, setDetails] = useState('');
  const [isExplicit, setIsExplicit] = useState(false);
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
        title, 
        location, 
        practice_area: practiceArea, 
        urgency_level: urgencyLevel,
        budget_tier: budgetTier,
        description: details, 
        is_explicit: isExplicit,
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
      setFile(null);
      setIsExplicit(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Submit New Legal Matter</h1>
          <p className="text-gray-400 text-sm">Push live matters directly to your Supabase PostgreSQL database.</p>
        </div>

        {successMsg && <div className="mb-6 p-4 bg-green-950 border border-green-800 text-green-300 rounded-lg text-sm">{successMsg}</div>}
        {errorMsg && <div className="mb-6 p-4 bg-red-950 border border-red-800 text-red-300 rounded-lg text-sm">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Matter Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3.5 rounded-lg bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-white transition"
              placeholder="e.g., Series B Global Corporate Restructuring"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Location (Country & Region)</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3.5 rounded-lg bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-white transition"
              >
                <optgroup label="United States">
                  <option value="US - California - Los Angeles / San Francisco">US - California (State Bar)</option>
                  <option value="US - New York - New York City">US - New York (State Bar)</option>
                  <option value="US - Texas - Houston / Dallas">US - Texas (State Bar)</option>
                  <option value="US - Florida - Miami / Orlando">US - Florida (State Bar)</option>
                  <option value="US - Illinois - Chicago">US - Illinois (State Bar)</option>
                </optgroup>
                <optgroup label="Canada">
                  <option value="Canada - Ontario - Toronto">Canada - Ontario (LSO)</option>
                  <option value="Canada - British Columbia - Vancouver">Canada - British Columbia (LSBC)</option>
                  <option value="Canada - Alberta - Calgary">Canada - Alberta (LSA)</option>
                  <option value="Canada - Quebec - Montreal">Canada - Quebec (Barreau)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Practice Area</label>
              <select
                value={practiceArea}
                onChange={(e) => setPracticeArea(e.target.value)}
                className="w-full p-3.5 rounded-lg bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-white transition"
              >
                <option value="Venture Capital & Corporate M&A">Venture Capital & Corporate M&A</option>
                <option value="Corporate & Commercial">Corporate & Commercial</option>
                <option value="Immigration Law">Immigration Law</option>
                <option value="Litigation & Dispute Resolution">Litigation & Dispute Resolution</option>
                <option value="Intellectual Property">Intellectual Property</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Urgency Level</label>
              <select
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                className="w-full p-3.5 rounded-lg bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-white transition"
              >
                <option value="Urgent (48-hour turnaround)">Urgent (48-hour turnaround)</option>
                <option value="Standard (1-2 weeks)">Standard (1-2 weeks)</option>
                <option value="Low Priority / Advisory">Low Priority / Advisory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Budget Tier</label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full p-3.5 rounded-lg bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-white transition"
              >
                <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                <option value="$50,000+">$50,000+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Matter Details & Objectives</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              rows={5}
              className="w-full p-3.5 rounded-lg bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-white transition"
              placeholder="Describe legal risks and required outcomes..."
            />
          </div>

          {/* Photo / Document Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Attach Photos / Evidence / Documents</label>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-black file:font-bold hover:file:bg-gray-200 cursor-pointer"
            />
          </div>

          {/* Explicit Content Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-950 border border-gray-800 rounded-lg">
            <input
              type="checkbox"
              id="explicitToggle"
              checked={isExplicit}
              onChange={(e) => setIsExplicit(e.target.checked)}
              className="w-5 h-5 accent-white rounded bg-gray-900 border-gray-700 cursor-pointer"
            />
            <label htmlFor="explicitToggle" className="text-sm text-gray-300 cursor-pointer select-none">
              Flag matter as containing <strong>sensitive / explicit details</strong> (Requires lawyer explicit request access to view fully).
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-lg tracking-widest uppercase transition shadow-lg mt-6"
          >
            {loading ? 'Pushing to Database...' : 'Submit to Live Database'}
          </button>
        </form>
      </div>
    </div>
  );
}
