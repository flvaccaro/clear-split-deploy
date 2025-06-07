import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.interface';
import { ExpensesService } from 'src/expenses/expenses.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly expenseService: ExpensesService,
    private readonly usersService: UsersService,
    @InjectModel('Event') private eventModel: Model<Event>
  ) {}

  async create(eventData: Partial<Event>): Promise<Event> {
    const newEvent = new this.eventModel(eventData);
    return newEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventModel.findById(id).exec();
  }

  async deleteById(id: string, userId: string) {
    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.createdBy !== userId) {
      throw new ForbiddenException('You can only delete events you created');
    }

    return this.eventModel.findByIdAndDelete(id).exec();
  }

  async addParticipant(eventId: string, userId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundException('Event not found');

    if (!event.participants.includes(userId)) {
      event.participants.push(userId);
      await event.save();
    }

    return event;
  }

  async calculateSettlement(eventId: string) {
    const event = await this.eventModel.findById(eventId).lean();
    if (!event) throw new NotFoundException('Event not found');

    const expenses = await this.expenseService.findByEventId(eventId);
    const users = await this.usersService.findManyByIds(event.participants);

    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]));

    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const perPerson = total / event.participants.length;

    const balances: Record<string, number> = {};
    for (const id of event.participants) {
      balances[id] = -perPerson;
    }
    for (const exp of expenses) {
      balances[exp.createdBy] += exp.amount;
    }

    const debtors = Object.entries(balances)
      .filter(([_, amount]) => amount < -1)
      .map(([id, amount]) => ({ id, amount: -amount }));

    const creditors = Object.entries(balances)
      .filter(([_, amount]) => amount > 1)
      .map(([id, amount]) => ({ id, amount }));

    const result = [];

    for (const debtor of debtors) {
      for (const creditor of creditors) {
        if (debtor.amount === 0) break;
        if (creditor.amount === 0) continue;

        const payment = Math.min(debtor.amount, creditor.amount);
        result.push({
          from: userMap[debtor.id],
          to: userMap[creditor.id],
          amount: Math.round(payment),
        });

        debtor.amount -= payment;
        creditor.amount -= payment;
      }
    }

    return result;
  }

  async updateEvent(eventId: string, userId: string, newTitle: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundException('Event not found');

    if (event.createdBy !== userId) {
      throw new ForbiddenException('You can only edit your own events');
    }

    event.title = newTitle;
    return event.save();
  }
}
