'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <main className={`min-h-screen flex flex-col justify-between p-8 transition-colors duration-200 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      <header className={`max-w-7xl mx-auto w-full flex justify-between items-center border-b pb-6 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-2">
          <span className={`font-bold text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>LawBridge</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/client" className={isDarkMode ? 'text-zinc-400 hover:text-white transition-colors' : 'text-zinc-600 hover:text-zinc-900 transition-colors'}>Client Portal</Link>
          <Link href="/lawyer" className={isDarkMode ? 'text-zinc-400 hover:text-white transition-colors' : 'text-zinc-600 hover:text-zinc-900 transition-colors'}>Lawyer Command Center</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto text-center space-y-6 my-auto">
        <div className={`inline-block px-4 py-1.5 rounded-full border text-xs font-medium tracking-wider uppercase ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
          ENTERPRISE-GRADE LEGAL INFRASTRUCTURE
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
          The Autonomous Operating System <br />
          <span className={isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}>for Legal Practice</span>
        </h1>

        <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Real-time multi-user redlining, AI-powered contract risk analysis, and automated escrow settlement backed by bank-grade vector search and RLS security.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/lawyer" className={`w-full sm:w-auto px-8 py-3.5 font-semibold rounded-md transition-colors text-sm text-center ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
            LAUNCH LAWYER WORKSPACE
          </Link>
          <Link href="/client" className={`w-full sm:w-auto px-8 py-3.5 border font-semibold rounded-md transition-colors text-sm text-center ${isDarkMode ? 'border-zinc-700 text-white hover:bg-zinc-900' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-100'}`}>
            VIEW CLIENT PORTAL
          </Link>
        </div>
      </div>

      <footer className={`max-w-7xl mx-auto w-full flex justify-between items-center text-xs pt-6 border-t ${isDarkMode ? 'border-zinc-900 text-zinc-500' : 'border-zinc-200 text-zinc-400'}`}>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className={`flex items-center gap-2 px-3 py-1.5 rounded shadow font-medium text-xs transition-colors ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
        >
          <span>{isDarkMode ? '☀️' : '🌙'}</span> {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
        <p>© 2026 LawBridge Systems.</p>
      </footer>
    </main>
  );
}
