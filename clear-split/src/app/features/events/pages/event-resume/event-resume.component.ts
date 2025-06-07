import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormattedAmountPipe } from '../../../../shared/pipes/formatted-amount.pipe';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { UserService } from '../../../../core/services/user.service';
import { EventService } from '../../../../core/services/event.service';
import { ExpenseService } from '../../../expenses/expense.service';

@Component({
  standalone: true,
  selector: 'app-event-resume',
  imports: [CommonModule, ReactiveFormsModule, FormattedAmountPipe],
  templateUrl: './event-resume.component.html'
})
export class EventResumeComponent {
  eventId: string | null;
  event: any = null;

  expenses: {
    description: string;
    amount: number;
    user: string;
    createdBy: string;
  }[] = [];

  showModal = false;
  expenseForm: FormGroup;

  currentUser: { email: string; id: string; name: string; } | null = null;

  showParticipantsModal = false;
  participants: any[] = [];

  createdByMap: Record<string, string> = {};

  isEditing = false;
  editingExpenseId: string | null = null;

  isOwner: boolean = false;
  eventFinalized: boolean = false;

  debtSummary: any[] = [];

  constructor(
    private expenseService: ExpenseService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authState: AuthStateService,
    private userService: UserService
  ) {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
    });

    this.currentUser = this.authState.getCurrentUser();

    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe(event => {
        this.event = event;
        this.isOwner = this.currentUser?.id === event.createdBy;
      });
    }

    this.loadExpenses();
  }

  loadExpenses() {
    if (!this.eventId) return;

    this.expenseService.getByEvent(this.eventId).subscribe(expenses => {
      this.expenses = expenses;
      const userIds = Array.from(new Set(expenses.map(e => e.createdBy)));

      this.userService.getUsersByIds(userIds).subscribe(users => {
        this.createdByMap = users.reduce((acc: Record<string, string>, user: any) => {
          acc[user._id] = user.name;
          return acc;
        }, {});
      });
    });
  }

  editExpense(expense: any) {
    this.isEditing = true;
    this.editingExpenseId = expense._id;
    this.expenseForm.patchValue({
      description: expense.description,
      amount: expense.amount,
    });
    this.showModal = true;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.expenseForm.reset();
  }

  saveExpense() {
    if (this.expenseForm.invalid || !this.eventId) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const { description, amount } = this.expenseForm.value;

    if (this.isEditing && this.editingExpenseId) {
      this.expenseService
        .updateExpense(this.eventId, this.editingExpenseId, { description, amount })
        .subscribe(() => {
          this.loadExpenses();
          this.closeModal();
          this.isEditing = false;
          this.editingExpenseId = null;
        });
    } else {
      this.expenseService
        .create(this.eventId, { description, amount })
        .subscribe((newExpense) => {
          this.expenses.push(newExpense);
          this.closeModal();
          this.loadExpenses();
        });
    }
  }


  get totalAmount(): number {
    return this.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }

  openParticipantsModal() {
    if (!this.eventId) return;

    this.eventService.getParticipants(this.eventId).subscribe((data) => {
      this.participants = data;
      this.showParticipantsModal = true;
    });
  }

  closeParticipantsModal() {
    this.showParticipantsModal = false;
    this.participants = [];
  }

  finalizeEvent() {
    this.eventFinalized = true;
    this.calculateDebtSummary();
  }

  calculateDebtSummary() {
    if (!this.eventId) return;

    this.eventService.getSettlement(this.eventId).subscribe(settlement => {
      this.debtSummary = settlement;
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  reopenEvent() {
    this.eventFinalized = false;
    this.debtSummary = [];
  }
}
