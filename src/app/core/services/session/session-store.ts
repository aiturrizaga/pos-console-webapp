import { computed, Injectable, signal } from '@angular/core';
import { SessionDto } from './session-db';

@Injectable({
  providedIn: 'root',
})
export class SessionStore {
  private readonly _session = signal<SessionDto | null>(null);

  readonly session = this._session.asReadonly();
  readonly ready = computed(() => this._session() !== null);

  readonly tenantId = computed(() => this._session()?.tenant?.id ?? null);
  readonly companyId = computed(() => this._session()?.company?.id ?? null);
  readonly company = computed(() => this._session()?.company ?? null);
  readonly userId = computed(() => this._session()?.user?.id ?? null);
  readonly user = computed(() => this._session()?.user ?? null);

  set(session: SessionDto): void {
    this._session.set(session);
  }

  clear(): void {
    this._session.set(null);
  }
}
