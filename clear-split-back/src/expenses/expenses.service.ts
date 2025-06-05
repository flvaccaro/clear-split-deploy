import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './expense.interface';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel('Expense') private expenseModel: Model<Expense>) {}

  create(expense: Partial<Expense>) {
    return new this.expenseModel(expense).save();
  }

  findByEventId(eventId: string) {
    return this.expenseModel.find({ eventId }).exec();
  }

  async updateExpense(expenseId: string, userId: string, update: { amount: number; description: string }) {
    const expense = await this.expenseModel.findById(expenseId);
    if (!expense) throw new NotFoundException('Expense not found');

    if (expense.createdBy !== userId) {
      throw new ForbiddenException('You can only edit your own expenses');
    }

    expense.amount = update.amount;
    expense.description = update.description;
    return expense.save();
  }
}
