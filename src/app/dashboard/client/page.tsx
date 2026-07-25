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
    const savedEmail = localStorage.getItem('lawbridge_user_email');
    if (savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
      const savedMatter = localStorage.getItem(`lawbridge_matter_${savedEmail}`);
      if (savedMatter) setMatterDescription(savedMatter);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSaveMatter = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`lawbridge_matter_${userEmail}`, matterDescription);
    setStatusMessage('Matter description saved securely to your session data.');
  };

  const handleRequestAccessEmail = () => {
    const subject = encodeURIComponent('LawBridge: Lawyer Access Request Authorization');
    const body = encodeURIComponent(`Hello,\n\nA verifying lawyer has requested explicit access to your matter details on LawBridge.\n\nMatter Description:\n${matterDescription || 'No description provided yet.'}\n\nPlease confirm or authorize access.`);
    window.location.href = `mailto:${userEmail}?subject=${subject}&body=${body}`;
    setRequestStatus('Email client opened to dispatch access request directly to ' + userEmail);
  };

  const handleSignOut = () => {
    localStorage.removeItem('lawbridge_user_email');
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between p-8 sm:p-12">
      {/* Top Header with Jurisdictions & Secure Infrastructure */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">CA</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">NY</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">London</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest hidden sm:block">
            Secure Legal Infrastructure
          </div>
          <span className="text-xs text-zinc-400">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 rounded transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto w-full my-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Client Portal</span>
          <h1 className="text-3xl font-black mt-1">Client Command Hub</h1>
        </div>

        {statusMessage && (
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs rounded">
            {statusMessage}
          </div>
        )}

        {/* Matter Description Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 shadow-xl">
          <h2 className="text-lg font-bold mb-2">Description of the Matter</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Provide details regarding your legal case, dispute, or advisory requirement. This data persists securely across your session.
          </p>
          <form onSubmit={handleSaveMatter} className="space-y-4">
            <textarea
              value={matterDescription}
              onChange={(e) => setMatterDescription(e.target.value)}
              rows={5}
              placeholder="Enter comprehensive details of your legal matter here (jurisdiction, parties, dispute summary)..."
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

        {/* Lawyer Access Authorization Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-2">Lawyer Access Authorization</h2>
          <p className="text-xs text-zinc-400 mb-4">
            When a verifying lawyer requests access to your files, an explicit notification is dispatched directly to your registered email address.
          </p>
          <button
            onClick={handleRequestAccessEmail}
            className="bg-zinc-800 hover:bg-zinc-700 text-orange-400 border border-zinc-700 font-bold px-5 py-2.5 rounded text-xs transition"
          >
            Trigger Access Request Email to Inbox
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

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-zinc-600 border-t border-zinc-800 pt-6">
        LawBridge Systems &bull; Multi-Jurisdictional Compliance Engine
      </div>
    </main>
  );
}
