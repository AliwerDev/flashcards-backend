// src/cards/cards.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCardDto, CreateCardsDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from '../models/card.scheme';
import { Box } from '../models/box.scheme';
import { FilterQueryDto } from './dto/filter-query.dto';
import { PlayedCardDto } from './dto/played-card.dto';
import { Review } from '../models/review.scheme';
@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    @InjectModel(Box.name) private readonly boxModule: Model<Box>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {
    const card: any = { ...createCardDto, userId };

    const box = await this.boxModule.findById(card.boxId);
    if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);
    card.categoryId = box.categoryId;

    const createdCard = new this.cardModel(card);
    return createdCard.save();
  }

  async createCards(cardsDto: CreateCardsDto, userId: string): Promise<Card[]> {
    const box = await this.boxModule.findById(cardsDto.boxId);
    if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);

    const cardsList = cardsDto.cards.map((card) => ({
      ...card,
      userId,
      categoryId: box.categoryId,
      boxId: cardsDto.boxId,
    }));

    try {
      await this.cardModel.insertMany(cardsList);
      return this.findAll({}, userId);
    } catch (error) {
      throw new HttpException(
        'Error creating cards',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, card: UpdateCardDto, userId: string): Promise<Card> {
    const existingCard = await this.cardModel.findOne({
      _id: id,
      userId: userId,
    });

    if (!existingCard) {
      throw new HttpException("Couldn't find card", HttpStatus.NOT_FOUND);
    }

    if (card.boxId && card.boxId !== String(existingCard.boxId)) {
      const box = await this.boxModule.findOne({
        _id: card.boxId,
        userId,
      });
      if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(existingCard, card);
    await existingCard.save();
    return existingCard;
  }

  async findAll(query: FilterQueryDto, userId: string): Promise<Card[]> {
    const filter: any = { userId };

    if (query.search) {
      filter.$or = [
        { front: { $regex: query.search, $options: 'i' } },
        { back: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.boxId) {
      filter.boxId = query.boxId;
    }

    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    return this.cardModel.find(filter).sort({ createdAt: -1 });
  }

  async getActiveCards(categoryId: string, userId: string): Promise<Card[]> {
    const categoryObjectId = new Types.ObjectId(categoryId);
    const userObjectId = new Types.ObjectId(userId);

    const now = Date.now();

    const cards: Card[] = await this.cardModel
      .aggregate([
        {
          $match: { userId: userObjectId, categoryId: categoryObjectId },
        },
        {
          $lookup: {
            from: 'boxes',
            localField: 'boxId',
            foreignField: '_id',
            as: 'box',
          },
        },
        {
          $unwind: '$box',
        },
        {
          $addFields: {
            nextReviewDate: {
              $add: [
                '$lastViewedDate',
                { $multiply: ['$box.reviewInterval', 1000] },
              ],
            },
          },
        },
        {
          $match: {
            nextReviewDate: { $lt: now },
          },
        },
        { $sort: { lastViewedDate: 1 } },
      ])
      .exec();

    return cards;
  }

  async findOne(id: string, userId: string) {
    const card = await this.cardModel.findOne({ _id: id, userId }).exec();
    if (!card) {
      throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
    }

    return card;
  }

  async remove(id: string, userId: string): Promise<Card> {
    const card = await this.cardModel.findOne({ _id: id, userId }).exec();

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return await this.cardModel.findOneAndDelete({ _id: id, userId }).exec();
  }

  async play(categoryId: string, playedCardDto: PlayedCardDto, userId: string) {
    const { cardId, correct } = playedCardDto;

    const card = await this.cardModel.findOne({ _id: cardId, userId }).exec();

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const boxes = await this.boxModule
      .find({ userId, categoryId })
      .sort({
        reviewInterval: 1,
      })
      .exec();

    const boxIndex = boxes.findIndex(
      (b) => String(b._id) === String(card.boxId),
    );

    const nextBox = correct ? boxes[boxIndex + 1] : boxes[boxIndex - 1];
    if (boxIndex >= 0 && nextBox) {
      card.boxId = nextBox._id as any;
    }
    card.lastViewedDate = Date.now();

    await card.save();
    await this.reviewModel.create({ cardId, userId, correct });
    return { success: true };
  }

  async getReviews(userId: string) {
    return await this.reviewModel.find({ userId });
  }
}
