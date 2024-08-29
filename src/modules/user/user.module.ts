import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/models/user.scheme';
import { CategoryModule } from '../category/category.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    CategoryModule,
    ChatModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
