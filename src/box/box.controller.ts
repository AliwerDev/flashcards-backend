// src/boxes/boxes.controller.ts
import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Delete,
} from '@nestjs/common';
import { BoxService } from './box.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Box } from '../models/box.scheme';
import { User } from '../decorators/user.decorator';
import { User as UserEntity } from '../models/user.scheme';
import { MongoIdParamDto } from '../shared/dto/mongoId-param.dto';

@ApiTags(Box.name)
@Controller('box')
export class BoxController {
  constructor(private readonly boxesService: BoxService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async create(@Body() box: CreateBoxDto, @User() user: UserEntity) {
    return this.boxesService.create(box, String(user._id));
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async update(
    @Param() params: MongoIdParamDto,
    @Body() updateBoxDto: UpdateBoxDto,
    @User() user: UserEntity,
  ) {
    return this.boxesService.update(params.id, updateBoxDto, String(user._id));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@User() user: UserEntity) {
    return this.boxesService.findAll(String(user._id));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async findOne(@Param() params: MongoIdParamDto, @User() user: UserEntity) {
    return this.boxesService.findOne(params.id, String(user._id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  remove(@Param() params: MongoIdParamDto, @User() user: UserEntity) {
    return this.boxesService.remove(params.id, String(user._id));
  }
}
