import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum TypeEnum {
  BOOK = 'book',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Topic extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop()
  description: string;

  @Prop()
  imgUrl: string;

  @Prop({ required: true, enum: TypeEnum, default: TypeEnum.OTHER })
  type: TypeEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: mongoose.Schema.Types.ObjectId;
}

export const TopicScheme = SchemaFactory.createForClass(Topic);
