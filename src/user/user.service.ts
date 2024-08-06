import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../models/user.scheme';
import { BoxService } from 'src/box/box.service';
import { UpdateRoleDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    readonly boxService: BoxService,
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
    await this.boxService.createDefaultBoxes(String(savedUser._id));
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
    const user = await this.userModel.findById(id, '-password');
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
