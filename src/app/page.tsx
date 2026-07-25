'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <main className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col justify-between p-8 sm:p-12`}>
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-800'}`}>CA</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-800'}`}>NY</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded ${darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-800'}`}>London</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest hidden sm:block">
            Secure Legal Infrastructure
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              darkMode ? 'border-zinc-700 bg-zinc-900 text-orange-400 hover:bg-zinc-800' : 'border-zinc-300 bg-zinc-100 text-orange-600 hover:bg-zinc-200'
            }`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <Link
            href="/login"
            className="text-xs font-bold px-3 py-1.5 rounded bg-orange-500 text-black hover:bg-orange-400 transition"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto text-center my-auto">
        <p className="text-orange-500 text-xs font-black uppercase tracking-widest mb-3">
          Production Ready
        </p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">
          LawBridge Platform
        </h1>
        <p className={`mb-8 text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Select your portal to begin testing:
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/verify-lawyer"
            className={`w-full sm:w-auto font-bold px-6 py-3 rounded-lg text-sm transition border ${
              darkMode ? 'bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800' : 'bg-zinc-100 text-black border-zinc-300 hover:bg-zinc-200'
            }`}
          >
            Lawyer Verification
          </Link>
          <Link
            href="/dashboard/client"
            className={`w-full sm:w-auto font-bold px-6 py-3 rounded-lg text-sm transition border ${
              darkMode ? 'bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800' : 'bg-zinc-100 text-black border-zinc-300 hover:bg-zinc-200'
            }`}
          >
            Client Command Hub
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className={`text-center text-xs ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
        LawBridge Systems &bull; Multi-Jurisdictional Compliance Engine
      </div>
    </main>
  );
}
