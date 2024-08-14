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
  Query,
} from '@nestjs/common';
import { BoxService } from './box.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Box } from '../models/box.scheme';
import { User } from '../decorators/user.decorator';
import { User as UserEntity } from '../models/user.scheme';
import { BoxSearchQueryDto } from './dto/search.dto';

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
    @Param('id') id: string,
    @Body() updateBoxDto: UpdateBoxDto,
    @User() user: UserEntity,
  ) {
    return this.boxesService.update(id, updateBoxDto, String(user._id));
  }

  @Get('list/:categoryId')
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Param('categoryId') categoryId: string,
    @Query() query: BoxSearchQueryDto,
    @User() user: UserEntity,
  ) {
    return this.boxesService.findAll(categoryId, String(user._id), query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.boxesService.findOne(id, String(user._id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  remove(@Param('id') id: string, @User() user: UserEntity) {
    return this.boxesService.remove(id, String(user._id));
  }
}
