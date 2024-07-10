import mongoose from 'mongoose';
import { User } from './user';

export interface Box extends mongoose.Document {
  userId: User;
  boxNumber: number;
  reviewInterval: number;
  createdAt: Date;
  updatedAt: Date;
}
