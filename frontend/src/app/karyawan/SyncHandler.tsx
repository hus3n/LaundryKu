'use client';

import { useEffect } from 'react';
import { syncQueue } from '@/lib/sync';

export default function SyncHandler() {
  useEffect(() => {
    // Initial sync check on mount
    syncQueue();

    // Listen to online events
    const handleOnline = () => {
      syncQueue();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
}
