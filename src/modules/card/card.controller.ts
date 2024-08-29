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
import { CreateCardDto } from './dto/create-card.dto';
import { CreateCardsDto } from './dto/create-cards.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user.decorator';
import { User as UserEntity } from 'src/models/user.scheme';
import { FilterQueryDto } from './dto/filter-query.dto';
import { PlayedCardDto } from './dto/played-card.dto';
import DeleteCardsDto from './dto/delete-cards.dto';
import { ValidateMongoIdPipe } from 'src/pipes/mongo-id.pipe';

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
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
    @User() user: UserEntity,
  ) {
    return this.cardService.update(id, updateCardDto, String(user._id));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: FilterQueryDto, @User() user: UserEntity) {
    return this.cardService.findAll(query, String(user._id));
  }

  @Get('active/:categoryId')
  @UseGuards(AuthGuard('jwt'))
  getActiveCards(
    @Param('categoryId', ValidateMongoIdPipe) categoryId: string,
    @User() user: UserEntity,
  ) {
    return this.cardService.getActiveCards(categoryId, String(user._id));
  }

  @Get('reviews')
  @UseGuards(AuthGuard('jwt'))
  reviews(@User() user: UserEntity) {
    return this.cardService.getReviews(String(user._id));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  findOne(
    @Param('id', ValidateMongoIdPipe) id: string,
    @User() user: UserEntity,
  ) {
    return this.cardService.findOne(id, String(user._id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  remove(
    @Param('id', ValidateMongoIdPipe) id: string,
    @User() user: UserEntity,
  ) {
    return this.cardService.delete(id, String(user._id));
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  removeList(@Body() deleteCardsDto: DeleteCardsDto, @User() user: UserEntity) {
    return this.cardService.deleteMany(deleteCardsDto, String(user._id));
  }

  @Post('play/:categoryId')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  play(
    @Param('categoryId', ValidateMongoIdPipe) categoryId: string,
    @Body() playedCardDto: PlayedCardDto,
    @User() user: UserEntity,
  ) {
    return this.cardService.play(categoryId, playedCardDto, String(user._id));
  }
}
