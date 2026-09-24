import Dexie, { Table } from 'dexie';

export interface KaryawanCacheEntry {
  id: string;
  type: string;
  data: unknown;
  updatedAt: number;
}

export type HttpMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type SyncStatus = 'pending' | 'failed' | 'synced';

export interface OutboxEntry {
  id?: number;
  url: string;
  method: HttpMethod;
  payload: unknown;
  createdAt: number;
  status: SyncStatus;
  retryCount: number;
}

export class LaundryKuDB extends Dexie {
  karyawan_cache!: Table<KaryawanCacheEntry, string>;
  sync_outbox!: Table<OutboxEntry, number>;

  constructor() {
    super('LaundryKuDB');
    this.version(1).stores({
      karyawan_cache: 'id, type, updatedAt',
      sync_outbox: '++id, status, createdAt',
    });
  }

  // --- karyawan_cache methods ---

  async putCached(type: string, items: unknown[]): Promise<void> {
    const now = Date.now();
    const entries: KaryawanCacheEntry[] = [];

    for (const item of items) {
      if (item && typeof item === 'object' && 'id' in item) {
        const itemId = String((item as { id: unknown }).id);
        entries.push({
          id: `${type}_${itemId}`,
          type,
          data: item,
          updatedAt: now,
        });
      }
    }

    if (entries.length > 0) {
      await this.karyawan_cache.bulkPut(entries);
    }
  }

  async getCached(type: string): Promise<KaryawanCacheEntry[]> {
    return await this.karyawan_cache.where('type').equals(type).toArray();
  }

  // --- sync_outbox methods ---

  async enqueue(entry: Omit<OutboxEntry, 'id' | 'createdAt' | 'status' | 'retryCount'>): Promise<number> {
    const newEntry: OutboxEntry = {
      ...entry,
      createdAt: Date.now(),
      status: 'pending',
      retryCount: 0,
    };
    return await this.sync_outbox.add(newEntry);
  }

  async peekPending(limit = 10): Promise<OutboxEntry[]> {
    return await this.sync_outbox
      .where('status')
      .equals('pending')
      .sortBy('createdAt')
      .then((items) => items.slice(0, limit));
  }

  async markSynced(id: number): Promise<void> {
    await this.sync_outbox.update(id, { status: 'synced' });
  }

  async markFailed(id: number): Promise<void> {
    const entry = await this.sync_outbox.get(id);
    if (entry) {
      await this.sync_outbox.update(id, {
        status: 'failed',
        retryCount: entry.retryCount + 1,
      });
    }
  }
}

export const db = new LaundryKuDB();
