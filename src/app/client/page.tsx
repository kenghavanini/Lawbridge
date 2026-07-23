'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ClientDashboard() {
  const [title, setTitle] = useState('')
  const [practiceArea, setPracticeArea] = useState('')
  const [region, setRegion] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('$5,000 - $10,000')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newCase = {
      id: Date.now().toString(),
      title,
      practice,
      region,
      clientName,
      clientContact,
      summary,
      description,
      budget,
      date: 'Just now'
    }

    // Retrieve existing cases or initialize empty array
    const existingCases = JSON.parse(localStorage.getItem('legal_market_cases') || '[]')
    localStorage.setItem('legal_market_cases', JSON.stringify([newCase, ...existingCases]))

    setSubmitted(true)
  }

  const practice = practiceArea // alias for clarity

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="bg-indigo-600 text-white p-1 rounded-lg text-xs">⚖️</span>
          LegalMarket
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/client" className="text-indigo-400 font-medium">Client Dashboard</Link>
          <Link href="/lawyer" className="text-slate-400 hover:text-white transition-colors">Lawyer Portal</Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Client Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Submit your legal matter securely for review by qualified local attorneys.</p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            ← Back Home
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl text-slate-900">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Submit a New Case</h2>
            <p className="text-sm text-slate-500">Provide case details and contact information for attorney matching.</p>
          </div>

          {submitted ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
              <div className="text-emerald-600 text-3xl">✓</div>
              <h3 className="text-lg font-bold text-emerald-900">Case Published Successfully</h3>
              <p className="text-sm text-emerald-700">Your brief is now live in the Lawyer Portal for regional attorneys to review and unlock.</p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  Submit Another Case
                </button>
                <Link
                  href="/lawyer"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  View in Lawyer Portal →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Your Name / Entity
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Contact Email / Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    placeholder="e.g., john@example.com / 416-555-0199"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Case Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Commercial Lease Dispute"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Practice Area
                  </label>
                  <select
                    required
                    value={practiceArea}
                    onChange={(e) => setPracticeArea(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select Practice Area...</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Civil Litigation">Civil Litigation</option>
                    <option value="Employment Law">Employment Law</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                    <option value="Real Estate">Real Estate Law</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Jurisdiction Region
                  </label>
                  <select
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select Region...</option>
                    <option value="Toronto, ON">Toronto, ON</option>
                    <option value="Vancouver, BC">Vancouver, BC</option>
                    <option value="Montreal, QC">Montreal, QC</option>
                    <option value="Calgary, AB">Calgary, AB</option>
                    <option value="Ottawa, ON">Ottawa, ON</option>
                    <option value="Edmonton, AB">Edmonton, AB</option>
                    <option value="New York, NY">New York, NY</option>
                    <option value="London, UK">London, UK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Estimated Budget / Retainer
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., $5,000 - $10,000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Anonymized Summary (Public Safe)
                </label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief summary visible to lawyers browsing regional cases..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Full Description & Details (Private - Unlocked by Attorney)
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed case background..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-4 font-semibold text-white shadow-lg hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Publish Case to Lawyer Portal
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
