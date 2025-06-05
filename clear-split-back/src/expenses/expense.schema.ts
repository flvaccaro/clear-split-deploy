import { Schema } from 'mongoose';

export const ExpenseSchema = new Schema({
  eventId: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  createdBy: { type: String, required: true }, // user ID
});