'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeSync(matterId: string) {
  const [activeUsers, setActiveUsers] = useState<unknown[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`matter:${matterId}`, {
      config: {
        presence: {
          key: 'lawyer-client-session',
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveUsers(Object.values(state).flat());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matterId]);

  return { activeUsers };
}
