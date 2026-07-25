'use client';
import Link from "next/link";
export function SiteHeader() {
  return (
    <header className="w-full border-b border-[#333] bg-black px-6 py-4 flex justify-between items-center text-white">
      <Link href="/" className="font-black tracking-tight text-lg">LawBridge</Link>
      <nav className="flex gap-6 text-sm font-medium text-gray-400">
        <Link href="/dashboard/client" className="hover:text-white transition">Client Hub</Link>
        <Link href="/verify-lawyer" className="hover:text-white transition">Lawyer Verification</Link>
        <Link href="/terms" className="hover:text-white transition">Terms</Link>
      </nav>
    </header>
  );
}
