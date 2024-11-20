import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth-routes').then((m) => m.ROUTES),
    pathMatch: 'full',
  },
  {
    path: 'your',
    loadChildren: () =>
      import('./content/content-routes').then((m) => m.ROUTES),
  },
  { path: '**', redirectTo: '' },
];
