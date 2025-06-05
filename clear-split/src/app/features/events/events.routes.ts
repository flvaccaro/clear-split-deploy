// events.routes.ts
import { Routes } from '@angular/router';
import { EventsComponent } from './pages/events.component';
import { authGuard } from '../../core/guards/auth.guard';
import { EventResumeComponent } from './pages/event-resume/event-resume.component';

export const eventRoutes: Routes = [
  {
    path: '',
    component: EventsComponent,
    canActivate: [authGuard] // 👈 protegido por token
  },
  { path: ':id', 
    component: EventResumeComponent,
    canActivate: [authGuard] 
  } // 👈 ruta dinámica
];