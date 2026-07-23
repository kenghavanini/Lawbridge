import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] font-sans text-[#11100F] pb-32">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-16 py-20 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#78716C] block mb-3">Infrastructure Overview</span>
          <h1 className="font-serif text-6xl font-light text-[#11100F] mb-4">Security Architecture</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#78716C] font-semibold">Enterprise Cryptographic Standards</p>
        </div>
        
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-14 space-y-8 text-sm text-[#57534E] font-light leading-relaxed shadow-xl">
          <p>LawBridge is engineered from the ground up upon uncompromising security and privacy principles designed specifically for elite corporate and private litigation matters.</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">AES-256 Zero-Knowledge Vault Encryption</h3>
          <p>All evidentiary documents, contracts, and addendums uploaded into client matters are encrypted using Advanced Encryption Standard (AES-256) with keys sequestered under client-side control.</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">Automated AI Bar Registry Verification</h3>
          <p>Our proprietary AI credentialing engine cross-references active state and international bar registries in real-time, instantly flagging disciplinary actions or inactive licenses to protect clients from fraudulent representation.</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">Immutable Escrow Milestones</h3>
          <p>Financial transactions are secured via smart escrow milestones, ensuring absolute transparency and protection for both corporate clients and verified attorneys.</p>
          
          <div className="pt-8 border-t border-[#E5E0D8] flex justify-between items-center text-xs font-bold uppercase tracking-[0.25em] text-[#11100F]">
            <Link href="/" className="hover:opacity-50">← Return to Overview</Link>
            <span className="text-emerald-700">AES-256 Certified</span>
          </div>
        </div>
      </div>
    </main>
  );
}
