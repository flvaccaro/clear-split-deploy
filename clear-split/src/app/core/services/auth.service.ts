import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    // this.user$ = this.afAuth.authState;
  }

  /** Registra en Auth y luego guarda perfil en Firestore */
  signup(email: string, password: string, alias: string, name: string) {
  return this.http.post<any>(`${this.apiUrl}/auth/signup`, {
    email,
    password,
    name,
    bankAlias: alias, // 👈 el backend espera aliasBancario
  }).pipe(
    tap((res) => {
      localStorage.setItem('lastSignupEmail', email);
      this.router.navigate(['/auth/login']);
    }),
    catchError((err) => {
      console.error('Error de signup', err);
      return throwError(() => err);
    })
  );
}

  /**
   * Login con email + contraseña
   * Devuelve un Observable de UserCredential
   */
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access_token);
        this.router.navigate(['/events']);
      }),
      catchError((err) => {
        console.error('Error de login', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Cierra sesión y redirige al login.
   */
  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth/login']);
  }

}
