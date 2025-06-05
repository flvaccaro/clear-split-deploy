import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const redirectIfLoggedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    router.navigate(['/events']);
    return false;
  }

  return true;
};
