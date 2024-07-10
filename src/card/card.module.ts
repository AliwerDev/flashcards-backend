import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from 'src/models/card.scheme';
import { SharedModule } from 'src/shared/shared.module';
import { Box, BoxSchema } from 'src/models/box.scheme';
import { Review, ReviewSchema } from 'src/models/review.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Box.name, schema: BoxSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),

    SharedModule,
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
