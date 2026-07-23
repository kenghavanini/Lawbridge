import React from "react";

export interface CaseCardProps {
  caseItem?: Record<string, unknown>;
  caseListing?: Record<string, unknown>;
}

export function CaseCard({ caseItem, caseListing }: CaseCardProps) {
  const item = caseItem || caseListing;
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h3 className="font-semibold text-lg">{String(item?.title ?? "Untitled Case")}</h3>
      <p className="text-sm text-gray-600 mt-1">{String(item?.anonymized_summary ?? "")}</p>
    </div>
  );
}

export default CaseCard;
