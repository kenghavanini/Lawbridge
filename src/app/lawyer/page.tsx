import LegalEditor from '@/components/editor/LegalEditor';

export default function LawyerDashboard() {
  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Lawyer Command Center</h1>
      <p className="text-gray-500 mb-6">Manage real-time redlines, contract risk analysis, and escrow milestones.</p>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Active Matter Drafting Room</h2>
        <LegalEditor />
      </div>
    </main>
  );
}

