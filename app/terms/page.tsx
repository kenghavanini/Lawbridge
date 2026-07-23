import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] font-sans text-[#11100F] pb-32">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-16 py-20 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#78716C] block mb-3">Legal Documentation</span>
          <h1 className="font-serif text-6xl font-light text-[#11100F] mb-4">Terms of Service</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#78716C] font-semibold">Last Updated: July 23, 2026</p>
        </div>
        
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-14 space-y-8 text-sm text-[#57534E] font-light leading-relaxed shadow-xl">
          <p>Welcome to LawBridge. By accessing our client portal or counsel terminal, you agree to adhere to our professional legal marketplace standards and terms of engagement.</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">1. Verified Practitioner Standards</h3>
          <p>All legal practitioners utilizing LawBridge must maintain active good standing with their respective bar authorities (such as the Solicitors Regulation Authority, State Bars of California/New York, or the Law Society of Ontario).</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">2. Escrow & Milestone Payments</h3>
          <p>Funds deposited by clients into LawBridge escrow vaults are securely held and disbursed only upon verified milestone completion and client sign-off.</p>
          
          <h3 className="font-serif text-3xl font-normal text-[#11100F] pt-4">3. Limitation of Liability</h3>
          <p>LawBridge acts as an elite technical bridge and marketplace platform connecting clients with independent legal counsel. Formal attorney-client relationships are established directly between the client and retained counsel upon execution of our secure retainer agreement.</p>
          
          <div className="pt-8 border-t border-[#E5E0D8] flex justify-between items-center text-xs font-bold uppercase tracking-[0.25em] text-[#11100F]">
            <Link href="/" className="hover:opacity-50">← Return to Overview</Link>
            <span className="text-emerald-700">LawBridge Standards</span>
          </div>
        </div>
      </div>
    </main>
  );
}
