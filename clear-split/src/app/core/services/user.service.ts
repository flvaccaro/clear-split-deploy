import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser() {
  return this.http.get<any>(`${this.apiUrl}/users/me`).pipe(
    map(user => ({
      ...user,
      id: user._id // ✅ agrega el alias
    }))
  );
}

  getUsersByIds(ids: string[]) {
    return this.http.post<any[]>(`${this.apiUrl}/users/bulk`, { ids });
  }
}
