import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

export interface SessionDto {
  tenant: { id: string; name?: string };
  company: { id: string; name?: string };
  user: { id: string; email: string; partnerId: number; active: boolean };
}

interface AppDbSchema extends DBSchema {
  session: {
    key: 'current';
    value: SessionDto;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SessionDb {
  private dbPromise: Promise<IDBPDatabase<AppDbSchema>> | null = null;

  private db() {
    if (!this.dbPromise) {
      this.dbPromise = openDB<AppDbSchema>('multipos-backoffice-app', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('session')) {
            db.createObjectStore('session');
          }
        }
      });
    }
    return this.dbPromise;
  }

  async get(): Promise<SessionDto | null> {
    const db = await this.db();
    return (await db.get('session', 'current')) ?? null;
  }

  async set(value: SessionDto): Promise<void> {
    const db = await this.db();
    await db.put('session', value, 'current');
  }

  async clear(): Promise<void> {
    const db = await this.db();
    await db.delete('session', 'current');
  }
}
