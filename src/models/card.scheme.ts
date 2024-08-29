import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface ICard {
  userId: string;
  boxId: string;
  wordId: string;
  categoryId: string;
  lastViewedDate: number;
  nextReviewDate: number;
}

@Schema({ timestamps: true })
export class Card extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true })
  boxId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  categoryId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word',
    required: true,
  })
  wordId: string;

  @Prop({ type: Number, default: Date.now() })
  lastViewedDate: number;

  @Prop({ type: Number, default: Date.now() })
  nextReviewDate: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
