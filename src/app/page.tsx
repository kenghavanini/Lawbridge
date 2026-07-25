'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-8">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full border border-zinc-800 mb-8">
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            Enterprise-Grade Legal Infrastructure
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
          The Autonomous Operating System<br className="hidden sm:block" /> for Legal Practice
        </h1>

        {/* Subheadline */}
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mb-12 leading-relaxed">
          Real-time multi-user redlining, AI-powered contract risk analysis, and automated escrow settlement backed by bank-grade vector search and RLS security.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <Link
            href="/verify-lawyer"
            className="w-full sm:w-auto bg-white text-black text-xs font-bold px-8 py-4 rounded-sm transition hover:bg-zinc-200 uppercase tracking-wider"
          >
            Launch Lawyer Workspace
          </Link>
          <Link
            href="/dashboard/client"
            className="w-full sm:w-auto bg-black text-white border border-zinc-600 text-xs font-bold px-8 py-4 rounded-sm transition hover:bg-zinc-900 uppercase tracking-wider"
          >
            View Client Portal
          </Link>
        </div>

      </div>
    </main>
  );
}
