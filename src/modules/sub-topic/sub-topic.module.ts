import { Module } from '@nestjs/common';
import { SubTopicService } from './sub-topic.service';
import { SubTopicController } from './sub-topic.controller';
import { SubTopic, SubTopicScheme } from 'src/models/sub-topic.scheme';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubTopic.name, schema: SubTopicScheme },
    ]),
  ],
  controllers: [SubTopicController],
  providers: [SubTopicService],
})
export class SubTopicModule {}
