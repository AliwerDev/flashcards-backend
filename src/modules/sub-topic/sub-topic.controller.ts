import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum, User as UserEntity } from 'src/models/user.scheme';
import { User } from 'src/decorators/user.decorator';
import { ValidateMongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { RolesGuard } from 'src/guards/roles.gueard';
import { SubTopicService } from './sub-topic.service';
import { UpdateSubTopicDto } from './dto/update.dto';
import { CreateSubTopicDto } from './dto/create.dto';

@Controller('sub-topic')
export class SubTopicController {
  constructor(private readonly subTopicService: SubTopicService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard(RoleEnum.ADMIN))
  @UsePipes(new ValidationPipe())
  create(@Body() createDto: CreateSubTopicDto, @User() user: UserEntity) {
    return this.subTopicService.create(createDto, String(user._id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard(RoleEnum.ADMIN))
  @UsePipes(new ValidationPipe())
  updateOne(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() updateDto: UpdateSubTopicDto,
    @User() user: UserEntity,
  ) {
    return this.subTopicService.updateOne(id, updateDto, String(user._id));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.subTopicService.getAll();
  }
}
