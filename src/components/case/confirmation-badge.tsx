import React from "react";

interface ConfirmationBadgeProps {
  status?: string;
  children?: React.ReactNode;
}

export function ConfirmationBadge({ status, children }: ConfirmationBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      {children || status || "Confirmed"}
    </span>
  );
}
