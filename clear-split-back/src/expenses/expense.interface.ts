import { Document } from 'mongoose';

export interface Expense extends Document {
  eventId: string;
  description: string;
  amount: number;
  createdBy: string;
}