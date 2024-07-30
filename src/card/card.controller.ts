import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto, CreateCardsDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../decorators/user.decorator';
import { User as UserEntity } from '../models/user.scheme';
import { FilterQueryDto } from './dto/filter-query.dto';
import { PlayedCardDto } from './dto/played-card.dto';
import { MongoIdParamDto } from '../shared/dto/mongoId-param.dto';

@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  create(@Body() createCardDto: CreateCardDto, @User() user: UserEntity) {
    return this.cardService.create(createCardDto, String(user._id));
  }

  @Post('list')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  createCards(
    @Body() createCardsDto: CreateCardsDto,
    @User() user: UserEntity,
  ) {
    return this.cardService.createCards(createCardsDto, String(user._id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  update(
    @Param() params: MongoIdParamDto,
    @Body() updateCardDto: UpdateCardDto,
    @User() user: UserEntity,
  ) {
    return this.cardService.update(params.id, updateCardDto, String(user._id));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: FilterQueryDto, @User() user: UserEntity) {
    return this.cardService.findAll(query, String(user._id));
  }

  @Get('active')
  @UseGuards(AuthGuard('jwt'))
  getActiveCards(@User() user: UserEntity) {
    return this.cardService.getActiveCards(String(user._id));
  }

  @Get('reviews')
  @UseGuards(AuthGuard('jwt'))
  reviews(@User() user: UserEntity) {
    return this.cardService.getReviews(String(user._id));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  findOne(@Param() params: MongoIdParamDto, @User() user: UserEntity) {
    return this.cardService.findOne(params.id, String(user._id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  remove(@Param() params: MongoIdParamDto, @User() user: UserEntity) {
    return this.cardService.remove(params.id, String(user._id));
  }

  @Post('play')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  play(@Body() playedCardDto: PlayedCardDto, @User() user: UserEntity) {
    return this.cardService.play(playedCardDto, String(user._id));
  }
}
