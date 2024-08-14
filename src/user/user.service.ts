import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../models/user.scheme';
import { UpdateRoleDto, UpdateUserDto } from './dto/update.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    readonly categoriesService: CategoriesService,
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
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { firstName: data.firstName, lastName: data.lastName },
    );
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
          $addFields: {
            cardCount: { $size: '$cards' },
          },
        },
        {
          $project: {
            cards: 0,
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

  async findById(id: string) {
    const userObjectId = new Types.ObjectId(id);

    const userArray = await this.userModel
      .aggregate([
        { $match: { _id: userObjectId } },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: 'userId',
            as: 'categories',
          },
        },
        {
          $project: {
            password: 0,
          },
        },
      ])
      .exec();
    const user = userArray.length > 0 ? userArray[0] : null;

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

  findByPayload(payload: any) {
    return this.userModel.findById(payload.sub);
  }
}
