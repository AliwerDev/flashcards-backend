import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../models/user.scheme';
import { CategoriesModule } from 'src/categories/categories.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    CategoriesModule,
    ChatModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
