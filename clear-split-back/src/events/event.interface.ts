import { Document } from 'mongoose';

export interface Event extends Document {
  title: string;
  date: string;
  createdBy: string;
  participants: string[];
}