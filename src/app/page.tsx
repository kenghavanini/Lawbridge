import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-4 text-white">
      <div className="max-w-3xl text-center space-y-6">
        <span className="rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-400 border border-indigo-500/20">
          Legal Marketplace Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Connecting Clients with Qualified Counsel
        </h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto">
          Select your portal below to get started. Clients can submit case intake securely, and lawyers can review regional briefs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href="/client"
            className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Client Portal</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/lawyer"
            className="w-full sm:w-auto rounded-xl bg-slate-800 border border-slate-700 px-8 py-4 font-semibold text-slate-200 shadow-lg hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span>Lawyer Portal (View Cases)</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
