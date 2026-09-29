import { Routes } from '@angular/router';
import { PlaceLayoutComponent } from './layouts/place-layout/place-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/intro/intro').then((m) => m.Intro),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },

  {
    path: 'place',
    component: PlaceLayoutComponent,

    children: [
      {
        path: ':slug',
        loadComponent: () => import('./pages/place/place').then((m) => m.Place),
      },
    ],
  },
];
