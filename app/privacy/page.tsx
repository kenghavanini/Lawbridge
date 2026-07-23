import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] font-sans text-[#11100F] pb-32">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-16 py-20 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#78716C] block mb-3">Legal Documentation</span>
          <h1 className="font-serif text-6xl font-light text-[#11100F] mb-4">Privacy Policy</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#78716C] font-semibold">Last Updated: July 23, 2026</p>
        </div>
        
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-14 space-y-8 text-sm text-[#57534E] font-light leading-relaxed shadow-xl">
          <p>At LawBridge, we treat your confidential legal briefs and evidentiary documents with utmost privilege and zero-knowledge protection. This Privacy Policy governs our data practices across the LawBridge digital flagship.</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">1. Information Collection</h3>
          <p>We collect essential intake details, professional bar credential numbers for verifying counsel, and encrypted documents transferred into our secure vaults. All personal information is handled in strict compliance with international legal standards.</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">2. Attorney-Client Privilege & AES-256 Vaults</h3>
          <p>All data stored in our AES-256 vaults is encrypted client-side. LawBridge personnel cannot decrypt or access privileged communications, strategic briefings, or evidentiary files exchanged between clients and verified counsel.</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">3. Data Security Measures</h3>
          <p>We implement military-grade encryption, continuous automated security auditing, and secure cloud infrastructure to ensure that your sensitive corporate or private legal matters remain strictly confidential.</p>
          
          <div className="pt-8 border-t border-[#E5E0D8] flex justify-between items-center text-xs font-bold uppercase tracking-[0.25em] text-[#11100F]">
            <Link href="/" className="hover:opacity-50">← Return to Overview</Link>
            <span className="text-emerald-700">Encrypted & Secure</span>
          </div>
        </div>
      </div>
    </main>
  );
}
