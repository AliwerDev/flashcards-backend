import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from 'src/models/topic.scheme';
import { SubTopic } from 'src/models/sub-topic.scheme';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
  ) {}

  async create(createTopicDto: CreateTopicDto, userId: string) {
    return await this.topicModel.create({
      ...createTopicDto,
      createdBy: userId,
    });
  }

  async updateOne(id: string, updateDto: UpdateTopicDto, userId: string) {
    const updatedTopic = await this.topicModel.findByIdAndUpdate(
      id,
      {
        ...updateDto,
        createdBy: userId,
      },
      { new: true },
    );

    if (!updatedTopic) {
      throw new NotFoundException('Topic not found');
    }

    return updatedTopic;
  }

  async getAll() {
    console.log(SubTopic.name);

    return await this.topicModel
      .aggregate([
        {
          $lookup: {
            from: 'subtopics',
            localField: '_id',
            foreignField: 'parentId',
            as: 'subTopics',
          },
        },
      ])
      .exec();
  }
}
