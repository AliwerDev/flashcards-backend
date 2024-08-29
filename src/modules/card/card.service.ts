// Import necessary modules and decorators from NestJS and Mongoose
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateCardsDto } from './dto/create-cards.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card, ICard } from 'src/models/card.scheme';
import { FilterQueryDto } from './dto/filter-query.dto';
import { PlayedCardDto } from './dto/played-card.dto';
import { Review } from 'src/models/review.scheme';
import { BoxService } from 'src/modules/box/box.service';
import DeleteCardsDto from './dto/delete-cards.dto';
import { WordService } from '../word/word.service';

// Injectable service class for handling Card-related operations
@Injectable()
export class CardService {
  // Injecting Mongoose models for Card, Box, and Review collections
  constructor(
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    readonly boxService: BoxService,
    readonly wordService: WordService,
  ) {}

  // Method to create a single card
  async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {
    const { boxId, ...wordData } = createCardDto;

    const box = await this.boxService.findOne(boxId, userId);
    if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);

    const word = await this.wordService.create(wordData, userId);

    const card: ICard = {
      boxId: createCardDto.boxId,
      userId,
      wordId: word._id as string,
      categoryId: String(box.categoryId),
      lastViewedDate: Date.now(),
      nextReviewDate: Date.now() + box.reviewInterval * 1000,
    };

    return new this.cardModel(card).save();
  }

  // Method to create multiple cards at once
  async createCards(cardsDto: CreateCardsDto, userId: string): Promise<Card[]> {
    // Find the box by its ID from the database
    const box = await this.boxService.findOne(cardsDto.boxId, userId);
    if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);

    try {
      const cardsList: ICard[] = [];

      for (const wordData of cardsDto.words) {
        const word = await this.wordService.create(wordData, userId);

        cardsList.push({
          wordId: word._id as string,
          userId,
          boxId: cardsDto.boxId,
          categoryId: String(box.categoryId),
          lastViewedDate: Date.now(),
          nextReviewDate: Date.now() + box.reviewInterval * 1000,
        });
      }

      return await this.cardModel.insertMany(cardsList);
    } catch (error) {
      throw new HttpException(
        'Error creating cards',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Method to update an existing card
  async update(
    id: string,
    { boxId, ...wordDto }: UpdateCardDto,
    userId: string,
  ): Promise<Card> {
    const existingCard = await this.cardModel.findOne({ _id: id, userId });

    if (!existingCard) {
      throw new HttpException("Couldn't find card", HttpStatus.NOT_FOUND);
    }

    // If the box ID is being updated, validate the new box ID
    if (boxId && boxId !== String(existingCard.boxId)) {
      const box = await this.boxService.findOne(boxId, userId);
      if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);
      existingCard.nextReviewDate = Date.now();
    }

    this.wordService.update(existingCard.wordId, wordDto, userId);

    return await existingCard.save();
  }

  // Method to retrieve all cards based on filter criteria
  async findAll(query: FilterQueryDto, userId: string): Promise<Card[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };

    //TODO: add searching

    if (query.boxId) {
      filter.boxId = new Types.ObjectId(query.boxId);
    }

    if (query.categoryId) {
      filter.categoryId = new Types.ObjectId(query.categoryId);
    }
    console.log(filter);

    // Return the filtered list of cards sorted by creation date
    return this.cardModel
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'words',
            localField: 'wordId',
            foreignField: '_id',
            as: 'word',
          },
        },
        { $unwind: '$word' },
        {
          $project: {
            __v: -1,
            updatedAt: -1,
            createdAt: -1,
            wordId: -1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ])
      .exec();
  }

  // Method to retrieve active cards that need review for a specific category
  async getActiveCards(categoryId: string, userId: string): Promise<Card[]> {
    const now = Date.now();

    const match: any = { userId: new Types.ObjectId(userId) };
    if (categoryId !== 'ALL') match.categoryId = new Types.ObjectId(categoryId);

    // Aggregate cards based on review intervals and return those that need review
    const cards: Card[] = await this.cardModel
      .aggregate([
        {
          $match: match,
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

  // Method to find a single card by its ID and user ID
  async findOne(id: string, userId: string) {
    const card = await this.cardModel.findOne({ _id: id, userId }).exec();
    if (!card) {
      throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
    }

    return card;
  }

  // Method to handle playing a card and updating its box based on correctness
  async play(categoryId: string, playedCardDto: PlayedCardDto, userId: string) {
    const { cardId, correct } = playedCardDto;

    const card = await this.cardModel.findOne({ _id: cardId, userId }).exec();

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const boxes = await this.boxService.findAll(categoryId, userId, {
      withCardCount: false,
    });

    const boxIndex = boxes.findIndex(
      (b) => String(b._id) === String(card.boxId),
    );

    let nextBox: any;

    if (correct) {
      nextBox =
        boxIndex < boxes.length - 1 ? boxes[boxIndex + 1] : boxes[boxIndex];
    } else {
      nextBox = boxes[0];
    }

    if (boxIndex >= 0 && nextBox) {
      card.boxId = nextBox._id;
      card.nextReviewDate = Date.now() + nextBox.reviewInterval * 1000;
    } else {
      throw new HttpException(
        'Error updating box',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    card.lastViewedDate = Date.now();

    // Save the updated card and log the review in the review collection
    await card.save();
    if (boxIndex !== 0)
      await this.reviewModel.create({ cardId, userId, correct, categoryId });
    return { success: true };
  }

  // Method to retrieve all review logs for the user
  async getReviews(userId: string) {
    return await this.reviewModel.find({ userId });
  }

  // =====================DELETE METHODS================================================
  async delete(id: string, userId: string): Promise<Card> {
    const card = await this.cardModel.findOne({ _id: id, userId }).exec();

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return await this.cardModel.findOneAndDelete({ _id: id, userId }).exec();
  }

  async deleteMany({ ids }: DeleteCardsDto, userId: string): Promise<Card[]> {
    const cards = await this.cardModel
      .find({ _id: { $in: ids }, userId })
      .exec();

    if (!cards.length) {
      throw new NotFoundException('No cards found for the provided IDs');
    }

    await this.cardModel.deleteMany({ _id: { $in: ids }, userId }).exec();

    return cards;
  }

  deleteByCategory(categoryId: string) {
    return this.cardModel.deleteMany({ categoryId });
  }
}
