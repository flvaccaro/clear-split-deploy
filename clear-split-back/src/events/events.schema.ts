import { Schema } from 'mongoose';

export const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  createdBy: { type: String, required: true }, // user ID
  participants: { type: [String], default: [] }, // array de user IDs
  finalized: { type: Boolean, default: false }
});