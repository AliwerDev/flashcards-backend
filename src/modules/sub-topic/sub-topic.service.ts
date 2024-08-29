import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubTopic } from 'src/models/sub-topic.scheme';
import { CreateSubTopicDto } from './dto/create.dto';
import { UpdateSubTopicDto } from './dto/update.dto';

@Injectable()
export class SubTopicService {
  constructor(
    @InjectModel(SubTopic.name) private readonly subTopicModel: Model<SubTopic>,
  ) {}

  async create(createDto: CreateSubTopicDto, userId: string) {
    return await this.subTopicModel.create({
      ...createDto,
      createdBy: userId,
    });
  }

  async updateOne(id: string, updateDto: UpdateSubTopicDto, userId: string) {
    const updatedSubTopic = await this.subTopicModel.findByIdAndUpdate(
      id,
      {
        ...updateDto,
        createdBy: userId,
      },
      { new: true },
    );

    if (!updatedSubTopic) {
      throw new NotFoundException('Topic not found');
    }

    return updatedSubTopic;
  }

  async getAll() {
    return await this.subTopicModel.find().exec();
  }
}
