'use client';

import { useTransition } from 'react';
// Adjust this path if your Server Actions are located elsewhere
import { sendMessage } from '@/app/actions/messaging'; 

export function MessageWrapper({ threadId, children }: { threadId: string, children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();

  const handleSendMessage = () => {
    startTransition(async () => {
      await sendMessage({ threadId, content: "Hello, I have an update regarding this case." });
    });
  };

  return (
    <div 
      onClick={handleSendMessage} 
      className={isPending ? "opacity-50 pointer-events-none cursor-not-allowed" : "cursor-pointer"}
    >
      {children}
    </div>
  );
}
