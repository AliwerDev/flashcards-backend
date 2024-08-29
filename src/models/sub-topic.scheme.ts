import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SubTopic extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true })
  parentId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop()
  description: string;

  @Prop()
  imgUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: mongoose.Schema.Types.ObjectId;
}

export const SubTopicScheme = SchemaFactory.createForClass(SubTopic);
