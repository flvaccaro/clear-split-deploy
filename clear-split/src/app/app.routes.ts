import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    children: authRoutes, // 👈 rutas hijas standalone
  },
  {
    path: 'events',
    loadChildren: () =>
      import('../app/features/events/events.routes').then(m => m.eventRoutes),
  },
  { path: '**', redirectTo: 'auth/login' },
];