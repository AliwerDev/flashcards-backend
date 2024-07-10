import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.scheme';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http.exaption.filter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
  exports: [],
})
export class SharedModule {}
