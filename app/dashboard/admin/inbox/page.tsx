'use client';

import { useState } from 'react';

export default function AdminInbox() {
  const [requests, setRequests] = useState([
    { id: 'req_1', lawyerName: 'John Doe', matterId: '2', status: 'pending' }
  ]);

  const approveRequest = async (reqId: string, matterId: string) => {
    await fetch('/api/approve-access', {
      method: 'POST',
      body: JSON.stringify({ reqId, matterId })
    });
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'approved' } : r));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded-lg shadow border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Inbox: Access Requests</h1>
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="p-4 border rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Lawyer: {req.lawyerName}</p>
              <p className="text-sm text-gray-500">Requested access to Matter #{req.matterId}</p>
            </div>
            {req.status === 'pending' ? (
              <button 
                onClick={() => approveRequest(req.id, req.matterId)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
              >
                Approve Access
              </button>
            ) : (
              <span className="text-green-600 font-bold">Approved</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
