'use client';

import { useState, useTransition } from 'react';
// Adjust this path to point to your actual Anthropic AI server action
import { runIntakeAssist } from '@/app/actions/ai'; 

export function AIWrapper({ caseId, children }: { caseId: string, children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleAI = () => {
    startTransition(async () => {
      const result = await runIntakeAssist(caseId);
      setAiResponse(result);
    });
  };

  return (
    <div>
      <div 
        onClick={handleAI} 
        className={isPending ? "opacity-50 pointer-events-none cursor-wait" : "cursor-pointer"}
      >
        {children}
      </div>
      
      {aiResponse && (
        <div className="mt-4 p-4 border rounded shadow-sm text-sm">
          {aiResponse}
        </div>
      )}
    </div>
  );
}
