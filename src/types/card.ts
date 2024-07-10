import mongoose from 'mongoose';

export interface Card extends mongoose.Document {
  userId: string;
  front: string;
  back: string;
  boxId: string;
  createdAt: Date;
  updatedAt: Date;
}
