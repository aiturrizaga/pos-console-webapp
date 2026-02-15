import { Routes } from '@angular/router';
import { SaleHistoryPage } from './pages/sale-history-page/sale-history-page';

export const routes: Routes = [
  {
    path: 'history',
    component: SaleHistoryPage
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'history'
  }
];
