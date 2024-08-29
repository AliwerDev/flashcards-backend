import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from 'src/models/card.scheme';
import { SharedModule } from '../shared/shared.module';
import { Box, BoxSchema } from 'src/models/box.scheme';
import { Review, ReviewSchema } from 'src/models/review.scheme';
import { BoxModule } from 'src/modules/box/box.module';
import { WordModule } from '../word/word.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Box.name, schema: BoxSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    BoxModule,
    WordModule,
    SharedModule,
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
