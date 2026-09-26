import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'eiffel-tower', loadComponent: () => import('./pages/eiffel-tower/eiffel-tower').then((m) => m.EiffelTower) },
   { path: 'chapter-01', loadComponent: () => import('./pages/chapter-01/chapter-01').then((m) => m.Chapter01) },
];
