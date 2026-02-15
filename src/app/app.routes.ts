import { Routes } from '@angular/router';
import { ShellLayout } from '@/shared/layouts/shell-layout';
import { canActivateAuthRole } from '@/core/guards/auth-guard';
import { UnauthorizedPage } from '@/core/pages/unauthorized-page';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayout,
    canActivate: [canActivateAuthRole],
    data: { roles: ['admin', 'cashier'] },
    children: [
      {
        path: 'cash-drawer',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/cash-drawer/cash-drawer.routes').then(m => m.routes)
      },
      {
        path: 'pos-session',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/pos-session/pos-session.routes').then(m => m.routes)
      },
      {
        path: 'sales',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/sale/sale.routes').then(m => m.routes)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'cash-drawer'
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPage
  }

];
