import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  getCurrentUser(): { email: string; id: string, name: string } | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload:', payload);
      return {
        email: payload.email,
        id: payload.sub,
        name: payload.name
      };
    } catch (e) {
      return null;
    }
  }
}
