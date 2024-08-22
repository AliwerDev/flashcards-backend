import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from '../models/card.scheme';
import { SharedModule } from '../shared/shared.module';
import { Box, BoxSchema } from '../models/box.scheme';
import { Review, ReviewSchema } from '../models/review.scheme';
import { BoxModule } from 'src/box/box.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Box.name, schema: BoxSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    BoxModule,
    SharedModule,
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
