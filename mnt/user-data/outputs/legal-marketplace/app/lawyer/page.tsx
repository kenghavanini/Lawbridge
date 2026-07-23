import Link from 'next/link';

export default function LawyerIndex() {
  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-16 flex flex-col justify-between">
      <header className="flex justify-between items-center border-b border-neutral-800 pb-6">
        <Link href="/" className="text-xl font-bold tracking-wider flex items-center gap-2">
          <span>⚖️</span> LawBridge
        </Link>
        <Link href="/client" className="text-sm text-neutral-400 hover:text-white transition-colors">Client Portal</Link>
      </header>

      <div className="max-w-2xl mx-auto text-center space-y-8 my-auto">
        <h1 className="text-4xl font-bold tracking-tight">Lawyer Command Center</h1>
        <p className="text-neutral-400">To maintain bank-grade RLS security and client confidentiality, all attorneys must verify their credentials before accessing the active job queue.</p>
        <div className="flex justify-center gap-4 pt-4">
          <Link 
            href="/lawyer/verify" 
            className="bg-white text-black font-semibold px-8 py-3.5 hover:bg-neutral-200 transition-colors uppercase text-sm tracking-wide"
          >
            Proceed to Verification
          </Link>
          <Link 
            href="/lawyer/jobs" 
            className="border border-white text-white font-semibold px-8 py-3.5 hover:bg-neutral-900 transition-colors uppercase text-sm tracking-wide"
          >
            View Job Queue Directly
          </Link>
        </div>
      </div>

      <footer className="text-center text-xs text-neutral-500 border-t border-neutral-900 pt-6">
        © 2026 LawBridge Systems. Secure Attorney Access.
      </footer>
    </main>
  );
}
