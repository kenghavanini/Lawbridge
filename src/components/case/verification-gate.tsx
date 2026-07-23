import React from "react";

export interface VerificationGateProps {
  status?: 'unverified' | 'pending_review' | 'approved';
  children?: React.ReactNode;
}

export function VerificationGate({ status = 'unverified', children }: VerificationGateProps) {
  if (status === 'approved') {
    return <>{children}</>;
  }
  return (
    <div className="p-6 border rounded-lg bg-yellow-50 text-yellow-800">
      <h2 className="font-bold text-lg">Verification Required</h2>
      <p className="text-sm mt-1">Your account status is currently: {status}. Please complete verification.</p>
      {children}
    </div>
  );
}
