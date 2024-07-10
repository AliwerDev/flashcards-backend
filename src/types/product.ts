import mongoose from 'mongoose';
import { User } from './user';

export interface Product extends mongoose.Document {
  title: string;
  description: string;
  price: string;
  amount: number;
  image: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
}
