'use client';

import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black capitalize mb-4">privacy</h1>
        <p className="text-gray-400 text-sm">Official privacy documentation for LawBridge.</p>
      </main>
    </div>
  );
}
