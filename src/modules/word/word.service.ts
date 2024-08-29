import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Word } from 'src/models/word.scheme';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';

@Injectable()
export class WordService {
  constructor(
    @InjectModel(Word.name) private readonly wordModel: Model<Word>,
  ) {}

  async create(
    createDto: CreateWordDto,
    userId: string,
    personal: boolean = true,
  ) {
    return await this.wordModel.create({
      ...createDto,
      createdBy: userId,
      personal,
    });
  }

  async update(id: string, updateDto: UpdateWordDto, userId: string) {
    return await this.wordModel.findByIdAndUpdate(id, {
      ...updateDto,
      createdBy: userId,
    });
  }
}
