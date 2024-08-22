// Import necessary modules and decorators from NestJS and Mongoose
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
import { Card, ICard } from '../models/card.scheme';
import { FilterQueryDto } from './dto/filter-query.dto';
import { PlayedCardDto } from './dto/played-card.dto';
import { Review } from '../models/review.scheme';
import { BoxService } from 'src/box/box.service';

// Injectable service class for handling Card-related operations
@Injectable()
export class CardService {
  // Injecting Mongoose models for Card, Box, and Review collections
  constructor(
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    readonly boxService: BoxService,
  ) {}

  // Method to create a single card
  async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {
    // Find the box by its ID from the database
    const box = await this.boxService.findOne(createCardDto.boxId, userId);
    if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);

    // Create a card object with necessary fields
    const card: ICard = {
      front: createCardDto.front,
      back: createCardDto.back,
      boxId: createCardDto.boxId,
      userId,
      categoryId: String(box.categoryId),
      lastViewedDate: Date.now(),
      nextReviewDate: Date.now() + box.reviewInterval * 1000,
    };

    // Save the card in the database and return the created card
    const createdCard = new this.cardModel(card);
    return createdCard.save();
  }

  // Method to create multiple cards at once
  async createCards(cardsDto: CreateCardsDto, userId: string): Promise<Card[]> {
    // Find the box by its ID from the database
    const box = await this.boxService.findOne(cardsDto.boxId, userId);
    if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);

    // Create an array of card objects based on the input DTO
    const cardsList: ICard[] = cardsDto.cards.map((card) => ({
      front: card.front,
      back: card.back,
      boxId: cardsDto.boxId,
      userId,
      categoryId: String(box.categoryId),
      lastViewedDate: Date.now(),
      nextReviewDate: Date.now() + box.reviewInterval * 1000,
    }));

    try {
      // Insert all the cards into the database
      await this.cardModel.insertMany(cardsList);
      // Return all the cards created by the user
      return this.findAll({}, userId);
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
    updateCardDto: UpdateCardDto,
    userId: string,
  ): Promise<Card> {
    // Find the card by its ID and user ID
    const existingCard = await this.cardModel.findOne({
      _id: id,
      userId: userId,
    });

    if (!existingCard) {
      throw new HttpException("Couldn't find card", HttpStatus.NOT_FOUND);
    }

    // If the box ID is being updated, validate the new box ID
    if (
      updateCardDto.boxId &&
      updateCardDto.boxId !== String(existingCard.boxId)
    ) {
      const box = await this.boxService.findOne(updateCardDto.boxId, userId);
      if (!box) throw new HttpException('Box not found', HttpStatus.NOT_FOUND);
      existingCard.nextReviewDate = Date.now();
    }

    // Update the card fields with the provided DTO values
    existingCard.front = updateCardDto.front || existingCard.front;
    existingCard.back = updateCardDto.back || existingCard.back;
    existingCard.boxId = updateCardDto.boxId || existingCard.boxId;

    // Save and return the updated card
    await existingCard.save();
    return existingCard;
  }

  // Method to retrieve all cards based on filter criteria
  async findAll(query: FilterQueryDto, userId: string): Promise<Card[]> {
    const filter: any = { userId };

    // Add search filter for card content if provided
    if (query.search) {
      filter.$or = [
        { front: { $regex: query.search, $options: 'i' } },
        { back: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Filter by box ID if provided
    if (query.boxId) {
      filter.boxId = query.boxId;
    }

    // Filter by category ID if provided
    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    // Return the filtered list of cards sorted by creation date
    return this.cardModel.find(filter).sort({ createdAt: -1 });
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

  // Method to delete a card by its ID and user ID
  async remove(id: string, userId: string): Promise<Card> {
    const card = await this.cardModel.findOne({ _id: id, userId }).exec();

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return await this.cardModel.findOneAndDelete({ _id: id, userId }).exec();
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

  async deleteMany(categoryId: string) {
    const result = await this.cardModel.deleteMany({ categoryId });
    if (result.deletedCount === 0) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }
}
