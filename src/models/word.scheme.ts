import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Word extends Document {
  @Prop({ required: true, type: String })
  word: string;

  @Prop()
  examples: string[];

  @Prop()
  synonyms: string[];

  @Prop()
  definition: string;

  @Prop({ required: true })
  translation: string;

  @Prop({ required: true, default: false, type: Boolean })
  isPublic: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTopic',
  })
  subTopicId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
