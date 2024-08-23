import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat, ChatScheme } from 'src/models/chat.scheme';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatScheme }]),
  ],
  controllers: [],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
