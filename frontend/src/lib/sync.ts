import axios from 'axios';
import { db } from './db';
import { api } from './api';

let isSyncing = false;

export async function syncQueue(): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return;
  }

  if (isSyncing) {
    return;
  }

  isSyncing = true;

  try {
    const pendingEntries = await db.peekPending();
    if (pendingEntries.length === 0) {
      isSyncing = false;
      return;
    }

    let processedAny = false;

    for (const entry of pendingEntries) {
      if (!entry.id) continue;

      try {
        await api({
          method: entry.method,
          url: entry.url,
          data: entry.payload,
        });

        // Success: mark as synced
        await db.markSynced(entry.id);
        processedAny = true;
      } catch (error) {
        // If it's a 4xx error (client error), mark as failed so it doesn't block indefinitely
        if (axios.isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
          await db.markFailed(entry.id);
          processedAny = true;
        }
        // If it's a 5xx error or network error, we leave it as pending to retry later
      }
    }

    const morePending = await db.peekPending(1);
    if (morePending.length > 0 && processedAny) {
      isSyncing = false;
      // Recursively call to process the next batch
      syncQueue();
      return;
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  } finally {
    isSyncing = false;
  }
}
