import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from 'src/models/card.scheme';
import { Review, ReviewSchema } from 'src/models/review.scheme';
import { Category, CategorySchema } from 'src/models/category.scheme';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
})
export class StatisticsModule {}
