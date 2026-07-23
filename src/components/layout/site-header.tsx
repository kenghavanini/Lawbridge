import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[#E5E0D8] bg-[#F8F5F0]/95 backdrop-blur-md px-16 py-8 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="font-serif text-3xl tracking-tight text-[#11100F] font-light flex items-center gap-4 group no-underline">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#11100F] group-hover:scale-150 transition-transform"></span>
        LawBridge<span className="text-[10px] uppercase tracking-[0.3em] font-sans text-[#78716C] ml-3 px-3.5 py-1.5 border border-[#E5E0D8] rounded-full bg-white/80 font-medium">Global Flagship</span>
      </Link>
      <nav className="hidden md:flex items-center gap-12 text-xs font-bold tracking-[0.25em] uppercase text-[#11100F]">
        <Link href="/" className="hover:opacity-40 transition-opacity">Overview</Link>
        <Link href="/client" className="hover:opacity-40 transition-opacity">Client Console</Link>
        <Link href="/lawyer" className="hover:opacity-40 transition-opacity">Counsel Terminal</Link>
        <Link href="/client" className="px-7 py-3.5 bg-[#11100F] text-[#F8F5F0] rounded-2xl hover:bg-[#292524] transition-all text-xs font-bold tracking-[0.25em] uppercase shadow-md">
          Secure Intake
        </Link>
      </nav>
    </header>
  );
}
