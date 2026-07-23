"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

export function ClientCaseForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="bg-white border border-[#EBE5DE] rounded-3xl p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="font-serif text-3xl text-[#1C1917] mb-2">Submit Your Legal Case</h2>
        <p className="text-[#57534E] text-sm font-light">Describe your matter and securely attach documents or photos for verified attorneys.</p>
      </div>
      
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Case posted successfully! Verified attorneys in your region can now review your matter and request access.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-2">Case Subject / Title</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Commercial Lease Agreement Review"
            className="w-full px-4 py-3.5 bg-[#F7F4F0]/60 border border-[#EBE5DE] rounded-2xl text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917] text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-2">Region & Jurisdiction</label>
          <select className="w-full px-4 py-3.5 bg-[#F7F4F0]/60 border border-[#EBE5DE] rounded-2xl text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917] text-sm transition-all">
            <option value="US-CA">California, United States (State Bar of California)</option>
            <option value="US-NY">New York, United States (New York State Bar Association)</option>
            <option value="US-TX">Texas, United States (State Bar of Texas)</option>
            <option value="GB">London / England & Wales (SRA)</option>
            <option value="CA">Toronto / Ontario, Canada (Law Society of Ontario)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-2">Case Summary</label>
          <textarea 
            rows={4}
            required
            placeholder="Provide details about your legal situation..."
            className="w-full px-4 py-3.5 bg-[#F7F4F0]/60 border border-[#EBE5DE] rounded-2xl text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917] text-sm transition-all"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1C1917] mb-2">Case Documents & Photos Vault</label>
          <div className="border-2 border-dashed border-[#EBE5DE] rounded-2xl p-6 text-center hover:border-[#1C1917] transition-colors bg-[#F7F4F0]/40">
            <input 
              type="file" 
              multiple 
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => setFiles(e.target.files)}
              className="hidden" 
              id="case-doc-upload"
            />
            <label htmlFor="case-doc-upload" className="cursor-pointer flex flex-col items-center">
              <div className="p-3 bg-white border border-[#EBE5DE] rounded-2xl shadow-sm text-[#1C1917] mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-[#1C1917] mb-1">Click to attach photos or documents</span>
              <span className="text-xs text-[#78716C]">PDF, PNG, JPG, DOCX up to 50MB</span>
            </label>
            {files && files.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#EBE5DE] text-left space-y-2">
                {Array.from(files).map((f, i) => (
                  <div key={i} className="text-xs text-[#57534E] flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#EBE5DE]">
                    <FileText className="w-4 h-4 text-[#78716C]" />
                    <span className="font-medium truncate">{f.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 px-6 bg-[#1C1917] hover:bg-[#292524] text-white font-medium rounded-2xl transition-all text-sm shadow-sm disabled:opacity-50"
        >
          {loading ? "Posting Case..." : "Post Case to LAWCONNECTOR"}
        </button>
      </form>
    </div>
  );
}
