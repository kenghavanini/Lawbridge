'use client';
import { useState } from 'react';

export default function SecureInbox({ 
  hasLawyerMessagedFirst, 
  matter, 
  isLawyer 
}: { 
  hasLawyerMessagedFirst: boolean; 
  matter?: { description: string; is_explicit: boolean; attachment_url?: string }; 
  isLawyer?: boolean;
}) {
  const [message, setMessage] = useState('');
  const [requestExplicit, setRequestExplicit] = useState(false);

  return (
    <div className="p-6 bg-gray-950 rounded-xl border border-gray-800 text-white space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h3 className="text-xl font-bold">Secure Lawyer Inbox</h3>
        <span className="text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">End-to-End Encrypted</span>
      </div>

      {/* Matter Content Viewer with Explicit Handling for Lawyers */}
      {matter && (
        <div className="p-4 bg-black border border-gray-800 rounded-lg space-y-3">
          <div className="text-xs uppercase text-gray-400 font-bold">Matter Briefing</div>
          <p className="text-sm text-gray-200">
            {matter.is_explicit && isLawyer && !requestExplicit ? (
              <span className="text-amber-400 italic">🔒 This matter contains sensitive/explicit details. You must request full access to view unredacted disclosures.</span>
            ) : (
              matter.description
            )}
          </p>

          {matter.is_explicit && isLawyer && !requestExplicit && (
            <button
              onClick={() => setRequestExplicit(true)}
              className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded transition"
            >
              Request Access to Explicit Details
            </button>
          )}

          {matter.attachment_url && (!matter.is_explicit || !isLawyer || requestExplicit) && (
            <div className="mt-2">
              <a 
                href={matter.attachment_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-blue-400 underline hover:text-blue-300"
              >
                View Attached Evidence / Photos ↗
              </a>
            </div>
          )}
        </div>
      )}

      {/* Secure Messaging Box */}
      {hasLawyerMessagedFirst ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your secure message..."
            className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-white"
          />
          <button className="px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg font-bold transition">Send</button>
        </div>
      ) : (
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 rounded-lg text-center text-sm">
          🔒 <strong>Secure Inbox Locked:</strong> You can only message lawyers who have initiated contact with you first.
        </div>
      )}
    </div>
  );
}
