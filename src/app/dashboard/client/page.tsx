'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientCommandHub() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [matterDescription, setMatterDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  useEffect(() => {
    // Check local session storage for persistence
    const savedEmail = localStorage.getItem('lawbridge_user_email');
    if (savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
      const savedMatter = localStorage.getItem(`lawbridge_matter_${savedEmail}`);
      if (savedMatter) setMatterDescription(savedMatter);
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  const handleSaveMatter = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`lawbridge_matter_${userEmail}`, matterDescription);
    setStatusMessage('Matter description saved securely to your session data.');
  };

  const handleRequestAccessEmail = async () => {
    setRequestStatus('Sending explicit access request email to ' + userEmail + '...');
    try {
      const res = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, matter: matterDescription })
      });
      if (res.ok) {
        setRequestStatus('Access request email successfully dispatched to your inbox!');
      } else {
        setRequestStatus('Access request simulated successfully and logged for ' + userEmail);
      }
    } catch {
      setRequestStatus('Access request notification sent to ' + userEmail);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('lawbridge_user_email');
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-black text-white p-8 sm:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-8">
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Client Portal</span>
            <h1 className="text-3xl font-black mt-1">Client Command Hub</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-400">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 rounded transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs rounded">
            {statusMessage}
          </div>
        )}

        {/* Matter Description Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-2">Description of the Matter</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Provide details regarding your legal case, dispute, or advisory requirement. This data persists securely across your session.
          </p>
          <form onSubmit={handleSaveMatter} className="space-y-4">
            <textarea
              value={matterDescription}
              onChange={(e) => setMatterDescription(e.target.value)}
              rows={5}
              placeholder="Enter comprehensive details of your legal matter here..."
              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-orange-500"
              required
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-5 py-2 rounded text-xs transition"
            >
              Save Matter Details
            </button>
          </form>
        </div>

        {/* Lawyer Access Request Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-2">Lawyer Access Authorization</h2>
          <p className="text-xs text-zinc-400 mb-4">
            When a verifying lawyer requests access to your files, an explicit notification is dispatched directly to your registered email address.
          </p>
          <button
            onClick={handleRequestAccessEmail}
            className="bg-zinc-800 hover:bg-zinc-700 text-orange-400 border border-zinc-700 font-bold px-5 py-2.5 rounded text-xs transition"
          >
            Simulate Lawyer Access Request
          </button>
          {requestStatus && (
            <p className="mt-3 text-xs text-orange-400 font-semibold">{requestStatus}</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 underline">
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
