'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientCommandHub() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // Expanded Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [caseLocation, setCaseLocation] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('Medium');
  const [budget, setBudget] = useState('');
  const [matterDescription, setMatterDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Lawyer Inquiries Inbox State
  const [inquiries, setInquiries] = useState([
    { id: 1, lawyerName: 'Mabrucco & Associates', firm: 'Mabrucco Legal', status: 'Pending Review', date: '2026-07-25' },
    { id: 2, lawyerName: 'Sterling & Croft LLP', firm: 'Sterling Global', status: 'Pending Review', date: '2026-07-24' }
  ]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('lawbridge_user_email');
    if (savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);

      // Load persisted data
      setFirstName(localStorage.getItem(`lawbridge_fname_${savedEmail}`) || '');
      setLastName(localStorage.getItem(`lawbridge_lname_${savedEmail}`) || '');
      setPhoneNumber(localStorage.getItem(`lawbridge_phone_${savedEmail}`) || '');
      setCaseLocation(localStorage.getItem(`lawbridge_loc_${savedEmail}`) || '');
      setUrgencyLevel(localStorage.getItem(`lawbridge_urgency_${savedEmail}`) || 'Medium');
      setBudget(localStorage.getItem(`lawbridge_budget_${savedEmail}`) || '');
      setMatterDescription(localStorage.getItem(`lawbridge_matter_${savedEmail}`) || '');
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`lawbridge_fname_${userEmail}`, firstName);
    localStorage.setItem(`lawbridge_lname_${userEmail}`, lastName);
    localStorage.setItem(`lawbridge_phone_${userEmail}`, phoneNumber);
    localStorage.setItem(`lawbridge_loc_${userEmail}`, caseLocation);
    localStorage.setItem(`lawbridge_urgency_${userEmail}`, urgencyLevel);
    localStorage.setItem(`lawbridge_budget_${userEmail}`, budget);
    localStorage.setItem(`lawbridge_matter_${userEmail}`, matterDescription);
    setStatusMessage('All case details and personal info saved securely.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
      setStatusMessage('Files uploaded and attached successfully.');
    }
  };

  const handleAuthorizeLawyer = (id: number) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: 'Authorized & Connected' } : inq));
    setStatusMessage('Lawyer access authorized successfully.');
  };

  const handleDenyLawyer = (id: number) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: 'Access Denied' } : inq));
    setStatusMessage('Lawyer access request denied.');
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
          <span className="text-xs font-bold px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">CA</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">NY</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">London</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest hidden sm:block">
            Secure Legal Infrastructure
          </div>
          <span className="text-xs text-zinc-300">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 rounded transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto w-full my-8 space-y-8">
        <div className="mb-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Client Portal</span>
          <h1 className="text-3xl font-black mt-1">Client Command Hub</h1>
        </div>

        {statusMessage && (
          <div className="p-4 bg-zinc-900 border border-zinc-700 text-white text-xs rounded">
            {statusMessage}
          </div>
        )}

        {/* Form: Personal Info & Case Details */}
        <form onSubmit={handleSaveAll} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-1">Personal & Contact Information</h2>
            <p className="text-xs text-zinc-400 mb-4">Provide your legal contact particulars.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Kenzo"
                  required
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Havanini"
                  required
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  required
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>
          </div>

          <hr className="border-zinc-800" />

          <div>
            <h2 className="text-lg font-bold mb-1">Case Parameters & Location</h2>
            <p className="text-xs text-zinc-400 mb-4">Specify jurisdiction, urgency, and financial compensation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Case Location / Jurisdiction</label>
                <input
                  type="text"
                  value={caseLocation}
                  onChange={e => setCaseLocation(e.target.value)}
                  placeholder="London, UK / New York, NY"
                  required
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Urgency Level</label>
                <select
                  value={urgencyLevel}
                  onChange={e => setUrgencyLevel(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical Emergency">Critical Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Budget / Compensation ($)</label>
                <input
                  type="text"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="e.g. $5,000 - $10,000"
                  required
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Description of the Matter</label>
                <textarea
                  value={matterDescription}
                  onChange={e => setMatterDescription(e.target.value)}
                  rows={4}
                  placeholder="Enter comprehensive details of your legal case, dispute, or advisory requirement..."
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Upload Photos & Case Documents</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                />
                {uploadedFiles.length > 0 && (
                  <ul className="mt-2 text-xs text-zinc-400 list-disc list-inside">
                    {uploadedFiles.map((file, idx) => (
                      <li key={idx}>Attached: {file}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 bg-white hover:bg-zinc-200 text-black font-bold px-5 py-2.5 rounded text-xs transition"
            >
              Save Case & Personal Details
            </button>
          </div>
        </form>

        {/* Lawyer Inquiries Inbox */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-1">Lawyer Inquiries Inbox</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Review incoming requests from verifying lawyers looking to access your case files. You have full authorization control.
          </p>

          <div className="space-y-3">
            {inquiries.map(inq => (
              <div key={inq.id} className="bg-black border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{inq.lawyerName}</h3>
                  <p className="text-xs text-zinc-400">{inq.firm} &bull; Requested on {inq.date}</p>
                  <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded border ${
                    inq.status === 'Authorized & Connected' ? 'border-zinc-700 bg-zinc-800 text-white' : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}>
                    Status: {inq.status}
                  </span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {inq.status === 'Pending Review' ? (
                    <>
                      <button
                        onClick={() => handleAuthorizeLawyer(inq.id)}
                        className="flex-1 sm:flex-none bg-white hover:bg-zinc-200 text-black font-bold px-3 py-1.5 rounded text-xs transition"
                      >
                        Authorize Access
                      </button>
                      <button
                        onClick={() => handleDenyLawyer(inq.id)}
                        className="flex-1 sm:flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-3 py-1.5 rounded text-xs transition"
                      >
                        Deny
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-zinc-500 font-semibold italic">Action Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
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
