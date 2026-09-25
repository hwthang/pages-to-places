import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'eiffel-tower', loadComponent: () => import('./pages/eiffel-tower/eiffel-tower').then((m) => m.EiffelTower) },
];
