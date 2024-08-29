import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WordService } from './word.service';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.gueard';
import { AuthGuard } from '@nestjs/passport';
import { CreateWordDto } from './dto/create-word.dto';
import { RoleEnum } from 'src/models/user.scheme';
import { User } from 'src/decorators/user.decorator';
import { User as UserEntity } from 'src/models/user.scheme';

@ApiTags('Word')
@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard(RoleEnum.ADMIN))
  @UsePipes(new ValidationPipe())
  create(@Body() createDto: CreateWordDto, @User() user: UserEntity) {
    return this.wordService.create(createDto, String(user._id), false);
  }
}
