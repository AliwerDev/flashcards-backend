import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthGuard } from '@nestjs/passport';
import { FilterQueryDto } from './dto/filter-query.dto';
import { User } from 'src/decorators/user.decorator';
import { User as UserEntity } from 'src/models/user.scheme';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  getAll(@Query() query: FilterQueryDto, @User() user: UserEntity) {
    return this.statisticsService.getAll(query, String(user._id));
  }

  @Get('reviews')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  reviews(@Query() query: FilterQueryDto, @User() user: UserEntity) {
    return this.statisticsService.getReviews(query, String(user._id));
  }

  @Get('new-cards')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  newCards(@Query() query: FilterQueryDto, @User() user: UserEntity) {
    return this.statisticsService.getNewCards(query, String(user._id));
  }
}
