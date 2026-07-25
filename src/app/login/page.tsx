'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('lawbridge_user_email', email);
    setMessage(isSignUp ? 'Account created! Redirecting to your matter...' : 'Signed in successfully! Redirecting...');
    setTimeout(() => {
      router.push('/dashboard/client');
    }, 500);
  };

  const handleSignOut = () => {
    localStorage.removeItem('lawbridge_user_email');
    setMessage('Signed out successfully. Session cleared.');
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between p-8">
      <div className="max-w-md mx-auto w-full my-auto bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">LawBridge Authentication</span>
          <h1 className="text-2xl font-bold mt-1">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-zinc-800 border border-zinc-700 text-white text-xs rounded text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
              placeholder="client@lawbridge.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-2.5 rounded text-sm transition"
          >
            {isSignUp ? 'Sign Up & Continue' : 'Sign In & Continue'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2 rounded text-xs transition"
          >
            Sign Out / Clear Session
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-400 hover:text-white text-center mt-2 transition"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
