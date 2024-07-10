import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IReview extends Document {
  readonly userId: string;
  readonly cardId: string;
  readonly reviewDate: Date;
  readonly correct: boolean;
}

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true })
  cardId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: Date, default: Date.now() })
  reviewDate: Date;

  @Prop({ required: true })
  correct: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
