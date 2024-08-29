import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/models/chat.scheme';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModule: Model<Chat>) {}

  async create(createChatDto: CreateChatDto) {
    const newChat = new this.chatModule(createChatDto);
    return await newChat.save();
  }

  async findOne(id: number) {
    const existChat = await this.chatModule.findOne({ id });
    return existChat;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
