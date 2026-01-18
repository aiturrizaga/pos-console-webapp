import { DestroyRef, effect, inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { SessionDb } from '@/core/services/session/session-db';
import { SessionStore } from '@/core/services/session/session-store';
import { SessionApi } from '@/core/services/session/session-api';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs } from 'keycloak-angular';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export function waitForKeycloakReady(): Promise<boolean> {
  const keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  const destroyRef = inject(DestroyRef);

  return new Promise<boolean>((resolve) => {
    // por si ya está listo, resolvemos de una
    const current = keycloakSignal();
    if (current?.type === KeycloakEventType.Ready) {
      resolve(!!typeEventArgs<ReadyArgs>(current.args));
      return;
    }

    // si aún no está listo, nos suscribimos hasta que llegue Ready
    const obs$ = toObservable(keycloakSignal);
    const sub = obs$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((evt) => {
        if (evt?.type === KeycloakEventType.Ready) {
          resolve(!!typeEventArgs<ReadyArgs>(evt.args));
          sub.unsubscribe(); // importante: evitar quedarse escuchando
        }
      });
  });
}

@Injectable({
  providedIn: 'root',
})
export class AppBootstrap {
  #keycloak = inject(Keycloak);
  #sessionDb =  inject(SessionDb);
  #sessionStore =  inject(SessionStore);
  #sessionApi =  inject(SessionApi);

  async init(): Promise<any> {
    const authenticated = await waitForKeycloakReady();
    const cached = await this.#sessionDb.get();

    if (cached) {
      this.#sessionStore.set(cached);
    }

    const user = await this.#keycloak.loadUserProfile();
    if (user && user.id) {
      console.log('Loaded user profile', user);

      const session = await this.#sessionApi.getMe(user.id);
      this.#sessionStore.set(session.data);
      await this.#sessionDb.set(session.data);
      return session;
    }

    return;
  }
}
