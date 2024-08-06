import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxService } from './box.service';
import { BoxController } from './box.controller';
import { Box, BoxSchema } from '../models/box.scheme';

@Module({
  imports: [MongooseModule.forFeature([{ name: Box.name, schema: BoxSchema }])],
  controllers: [BoxController],
  providers: [BoxService],
  exports: [BoxService],
})
export class BoxModule {}
