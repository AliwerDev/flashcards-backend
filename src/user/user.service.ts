import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/models/user.scheme';
import { Box } from 'src/models/box.scheme';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Box.name) private boxModel: Model<Box>,
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
    await this.boxModel.create({ reviewInterval: 0, userId: savedUser._id });
    return this.omitPassword(email);
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
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.omitPassword(user.email);
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
