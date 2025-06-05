import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByEvent(eventId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/events/${eventId}/expenses`);
  }

  create(eventId: string, expense: { description: string; amount: number }) {
    return this.http.post<any>(`${this.apiUrl}/events/${eventId}/expenses`, expense);
  }

  updateExpense(eventId: string, expenseId: string, data: { amount: number; description: string }) {
    return this.http.patch(`${this.apiUrl}/events/${eventId}/expenses/${expenseId}`, data);
  }
}
