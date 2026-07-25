'use client';

import { useState } from 'react';

export default function LawyerDashboard() {
  // Mock data representing Supabase fetch
  const [matters] = useState([
    { id: '1', title: 'Corporate Merger Docs', isExplicit: false, desc: 'Need review of M&A contracts.' },
    { id: '2', title: '[RESTRICTED MATTER]', isExplicit: true, desc: 'Hidden until access is granted.' }
  ]);

  const requestAccess = async (matterId: string) => {
    await fetch('/api/request-access', {
      method: 'POST',
      body: JSON.stringify({ matterId, lawyerId: 'lawyer-123' })
    });
    alert('Access request sent to Admin Inbox.');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Available Matters</h1>
      <div className="space-y-4">
        {matters.map(matter => (
          <div key={matter.id} className="p-6 bg-white shadow rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold">{matter.title}</h2>
            {matter.isExplicit ? (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 font-medium mb-3">⚠️ This matter contains sensitive/explicit material. Access is restricted.</p>
                <button 
                  onClick={() => requestAccess(matter.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                >
                  Request Access
                </button>
              </div>
            ) : (
              <p className="mt-2 text-gray-600">{matter.desc}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
