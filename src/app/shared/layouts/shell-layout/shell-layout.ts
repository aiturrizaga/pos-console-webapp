import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { getInitials } from '@/shared/utils/string.util';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SessionStore } from '@/core/services/session/session-store';

@Component({
  selector: 'app-shell-layout',
  imports: [
    RouterOutlet,
    DrawerModule,
    RouterLink,
    Avatar,
    RouterLinkActive,
    MenuModule,
    ButtonModule,
    Ripple
  ],
  templateUrl: './shell-layout.html',
  styles: ``,
})
export class ShellLayout implements OnInit {
  profile = signal<KeycloakProfile | null>(null);
  private keycloak = inject(Keycloak);
  sessionStore = inject(SessionStore);

  menuItems = signal<MenuItem[]>([
    {
      id: '1',
      icon: 'ti ti-receipt-dollar text-2xl',
      label: 'Caja registradora',
      routerLink: 'cash-drawer'
    },
    {
      id: '2',
      icon: 'ti ti-database-dollar text-2xl',
      label: 'Sesion de caja',
      routerLink: 'pos-session'
    },
  ]);
  userOptions = signal<MenuItem[]>([
    {
      separator: true
    },
    {
      label: 'Ajustes',
      icon: 'ti ti-user-cog',
    },
    {
      label: 'Backoffice',
      icon: 'ti ti-building',
    },
    {
      label: 'Cerrar sesión',
      icon: 'ti ti-logout',
      iconClass: 'text-red-600!',
      linkClass: 'text-red-600! dark:text-red-400! hover:bg-red-50!',
      command: () => this.logout()
    }
  ]);

  ngOnInit(): void {
    this.keycloak.loadUserProfile().then(profile => {
      this.profile.set(profile);
    })
  }

  logout(): void {
    this.keycloak.logout({
      redirectUri: window.location.origin
    }).then();
  }

  get fullName(): string {
    return `${this.profile()?.firstName} ${this.profile()?.lastName}`;
  }

  get avatar(): string {
    return getInitials(this.fullName, true);
  }
}
