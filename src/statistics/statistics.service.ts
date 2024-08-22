import { Inject, Injectable } from '@nestjs/common';
import { FilterQueryDto } from './dto/filter-query.dto';
import { Card } from 'src/models/card.scheme';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from 'src/models/review.scheme';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private createCacheKey(
    key: string,
    query: FilterQueryDto,
    userId: string,
  ): string {
    const from = new Date(+query.from).toDateString(),
      to = new Date(+query.to).toDateString();
    return `statistics.${key}.${query.categoryId + from + to}.${userId}`;
  }

  async getReviews(query: FilterQueryDto, userId: string) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const fromDate = query.from ? new Date(+query.from) : firstDayOfMonth;
    const endDate = query.to ? new Date(+query.to) : now;

    const reviews = await this.reviewModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          createdAt: {
            $gte: fromDate,
            $lte: endDate,
          },
        },
      },
      {
        $project: {
          date: {
            $dateToString: { format: '%Y.%m.%d', date: '$createdAt' },
          },
          correct: 1,
        },
      },
      {
        $group: {
          _id: '$date',
          correct: {
            $sum: {
              $cond: [{ $eq: ['$correct', true] }, 1, 0],
            },
          },
          incorrect: {
            $sum: {
              $cond: [{ $eq: ['$correct', false] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return reviews;
  }

  async getNewCards(query: FilterQueryDto, userId: string) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const fromDate = query.from ? new Date(+query.from) : firstDayOfMonth;
    const endDate = query.to ? new Date(+query.to) : now;

    const cards = await this.cardModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          createdAt: {
            $gte: fromDate,
            $lte: endDate,
          },
        },
      },
      {
        $project: {
          date: {
            $dateToString: { format: '%Y.%m.%d', date: '$createdAt' },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return cards;
  }

  async getAll(query: FilterQueryDto, userId: string) {
    const cacheKey = this.createCacheKey('all', query, userId);
    let statistics: any = await this.cacheManager.get(cacheKey);

    if (!statistics) {
      statistics = {};
      statistics.reviews = await this.getReviews(query, userId);
      statistics.newcards = await this.getNewCards(query, userId);

      await this.cacheManager.set(cacheKey, statistics);
    }

    return statistics;
  }
}
