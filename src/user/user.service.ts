import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../models/user.scheme';
import { UpdateRoleDto, UpdateUserDto } from './dto/update.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { ChatService } from 'src/chat/chat.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(User.name) private userModel: Model<User>,
    readonly categoriesService: CategoriesService,
    readonly chatService: ChatService,
  ) {}

  private omitPassword(email: string) {
    return this.userModel.findOne({ email }).select('-password');
  }

  async create(userDto: RegisterDto) {
    const { email } = userDto;
    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = new this.userModel(userDto);
    const savedUser = await newUser.save();

    // CREATE DEFAULT BOX FOR USER

    const defaultCategory = await this.categoriesService.create(
      { title: 'Default' },
      String(savedUser._id),
    );

    if (!defaultCategory) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.omitPassword(email);
  }

  async updateRole(data: UpdateRoleDto, user: User) {
    if (user.role !== 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.userModel.findOneAndUpdate(
      { _id: data.userId },
      { role: data.role },
    );
  }

  async updateUser(data: UpdateUserDto, userId: string) {
    const user = await this.userModel.findOne({ _id: userId });

    user.firstName = data.firstName;
    user.lastName = data.lastName;
    await user.save();

    await this.cacheManager.set(userId, user);
    return user;
  }

  async connectTgAccaunt(chat: CreateChatDto) {
    const existChat = await this.chatService.findOne(chat.id);
    if (existChat) {
      throw new HttpException('Chat already connected', HttpStatus.CONFLICT);
    }

    const user = await this.userModel.findOne({ _id: chat.userId }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.chatService.create(chat);

    return user;
  }

  async findAll(user: User) {
    if (user.role !== 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const users = await this.userModel
      .aggregate([
        {
          $lookup: {
            from: 'cards',
            localField: '_id',
            foreignField: 'userId',
            as: 'cards',
          },
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'userId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            cardCount: { $size: '$cards' },
            reviewsCount: { $size: '$reviews' },
          },
        },
        {
          $project: {
            cards: 0,
            reviews: 0,
            password: 0,
          },
        },
      ])
      .exec();
    return users;
  }

  async findByLogin(userDto: LoginDto) {
    const { email, password } = userDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.omitPassword(email);
  }

  async findById(_id: string) {
    let user = await this.cacheManager.get(_id);

    if (!user) {
      user = await this.userModel.findOne({ _id });
      await this.cacheManager.set(_id, user, 1000 * 60 * 60);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }
    return this.omitPassword(user.email);
  }

  async findByPayload(payload: any) {
    let user = await this.cacheManager.get(payload.sub);

    if (!user) {
      user = await this.userModel.findById(payload.sub);
      this.cacheManager.set(payload.sub, user, 1000 * 60 * 60);
    }

    return user;
  }
}
