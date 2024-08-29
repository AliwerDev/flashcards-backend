import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicScheme } from 'src/models/topic.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicScheme }]),
  ],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
