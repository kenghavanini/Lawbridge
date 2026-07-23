"use client";

import { useState } from "react";
import { ChevronDown, BarChart3, PieChart, ShieldCheck } from "lucide-react";

export function DropdownAnalytics() {
  const [openSection, setOpenSection] = useState<string | null>("metrics");

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="bg-white border border-[#EBE5DE] rounded-3xl p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-6 border-b border-[#F7F4F0]">
        <div className="p-3 bg-[#F7F4F0] rounded-2xl text-[#1C1917]">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif text-2xl text-[#1C1917]">Platform Analytics & Metrics</h3>
          <p className="text-xs text-[#78716C] font-light">Interactive dropdown charts and real-time marketplace stats</p>
        </div>
      </div>

      {/* Dropdown 1: Case Match Distribution */}
      <div className="border border-[#EBE5DE] rounded-2xl overflow-hidden transition-all">
        <button 
          onClick={() => toggle("metrics")}
          className="w-full px-6 py-4 bg-[#F7F4F0]/50 flex items-center justify-between text-left font-serif text-lg text-[#1C1917] hover:bg-[#F7F4F0] transition-colors"
        >
          <span className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#57534E]" /> Regional Jurisdiction Breakdown
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform ${openSection === "metrics" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "metrics" && (
          <div className="p-6 bg-white space-y-4 text-sm text-[#57534E]">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium"><span>California Bar (US-CA)</span><span>42%</span></div>
              <div className="w-full bg-[#F7F4F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1C1917] h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium"><span>New York Bar (US-NY)</span><span>28%</span></div>
              <div className="w-full bg-[#F7F4F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1C1917] h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium"><span>England & Wales (SRA)</span><span>18%</span></div>
              <div className="w-full bg-[#F7F4F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1C1917] h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium"><span>Ontario, Canada</span><span>12%</span></div>
              <div className="w-full bg-[#F7F4F0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1C1917] h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown 2: Verification Security Status */}
      <div className="border border-[#EBE5DE] rounded-2xl overflow-hidden transition-all">
        <button 
          onClick={() => toggle("security")}
          className="w-full px-6 py-4 bg-[#F7F4F0]/50 flex items-center justify-between text-left font-serif text-lg text-[#1C1917] hover:bg-[#F7F4F0] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#57534E]" /> Document & Vault Security Status
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform ${openSection === "security" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "security" && (
          <div className="p-6 bg-white space-y-3 text-sm text-[#57534E] font-light">
            <div className="flex items-center justify-between p-3 bg-[#F7F4F0]/40 rounded-xl">
              <span>End-to-End Encryption (AES-256)</span>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F7F4F0]/40 rounded-xl">
              <span>Automated Bar Registry Cross-Check</span>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
