import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getAllEvents() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createEvent(title: string) {
    return this.http.post<any>(this.apiUrl, { title });
  }

  getEventById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteEvent(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getParticipants(eventId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/participants`);
  }

  joinEvent(eventId: string) {
    return this.http.patch<any>(`${this.apiUrl}/${eventId}/participants`, {});
  }

  getSettlement(eventId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/settlement`);
  }

  updateEvent(id: string, data: { title: string }) {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  finalizeEvent(eventId: string) {
    return this.http.patch(`${this.apiUrl}/${eventId}/finalize`, {});
  }

  reopenEvent(eventId: string) {
    return this.http.patch(`${this.apiUrl}/${eventId}/reopen`, {});
  }
}
