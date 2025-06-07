import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';

@Component({
  standalone: true,
  selector: 'app-events',
  imports: [CommonModule, RouterModule, CardComponent, ReactiveFormsModule],
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  currentUserId: string;
  addEventForm: FormGroup;
  showAddModal = false;
  isEditing = false;
  editingEventId: string | null = null;
  showDeleteConfirmModal = false;
  eventToDelete: any = null;

  events: any[] = []; // This should ideally be typed with an Event interface

  openEventMenuId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authState: AuthStateService,
    private eventService: EventService,
  ) {
    this.currentUserId = this.authState.getCurrentUser()?.id ?? '';
    this.addEventForm = this.fb.group({
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.eventService.getAllEvents().subscribe(events => {
    //   this.events = events;
    // });
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events.map(e => ({
        ...e,
        id: e._id || e.id, // aseguramos tener id para routerLink
      }));
    });
  }

  openAddEventModal() {
    this.isEditing = false;
    this.editingEventId = null;
    this.addEventForm.reset();
    this.showAddModal = true;
  }

  editEvent(event: any) {
    this.isEditing = true;
    this.editingEventId = event._id;
    this.addEventForm.patchValue({
      title: event.title,
    });
    this.showAddModal = true;
  }

  deleteEvent(event: any) {
    // logic to delete
  }

  joinEvent(event: any) {
    this.eventService.joinEvent(event._id).subscribe({
      next: (updatedEvent) => {
        // Actualizamos localmente
        event.participants = updatedEvent.participants;
      },
      error: (err) => {
        console.error('Failed to join event', err);
      }
    });
  }

  cancelAddEvent() {
    this.showAddModal = false;
    this.addEventForm.reset();
  }

  saveEvent() {
    if (this.addEventForm.invalid) {
      this.addEventForm.markAllAsTouched();
      return;
    }

    const title = this.addEventForm.value.title;

    if (this.isEditing && this.editingEventId) {
      this.eventService.updateEvent(this.editingEventId, { title }).subscribe(() => {
        this.loadEvents();
        this.showAddModal = false;
        this.isEditing = false;
        this.editingEventId = null;
      });
    } else {
      this.eventService.createEvent(title).subscribe(newEvent => {
        this.events.push(newEvent);
        this.cancelAddEvent();
      });
    }
  }

  confirmDeleteEvent(event: any) {
    this.eventToDelete = event;
    this.showDeleteConfirmModal = true;
  }

  cancelDelete() {
    this.eventToDelete = null;
    this.showDeleteConfirmModal = false;
  }

  deleteConfirmed() {
    if (!this.eventToDelete) return;
    this.eventService.deleteEvent(this.eventToDelete._id).subscribe({
      next: () => {
        this.events = this.events.filter(e => e._id !== this.eventToDelete._id);
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Failed to delete event:', err);
        this.cancelDelete();
      }
    });
  }

  toggleEventActionMenu(eventId: string) {
    this.openEventMenuId = this.openEventMenuId === eventId ? null : eventId;
  }

  closeEventActionMenu() {
    this.openEventMenuId = null;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.closeEventActionMenu();
    }
  }
}
