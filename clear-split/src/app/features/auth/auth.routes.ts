import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { redirectIfLoggedInGuard } from '../../core/guards/redirect-auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [redirectIfLoggedInGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [redirectIfLoggedInGuard]
  }
];
