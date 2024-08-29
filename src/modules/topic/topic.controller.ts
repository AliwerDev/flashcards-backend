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
import { TopicService } from './topic.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum, User as UserEntity } from 'src/models/user.scheme';
import { User } from 'src/decorators/user.decorator';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic-dto';
import { ValidateMongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { RolesGuard } from 'src/guards/roles.gueard';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard(RoleEnum.ADMIN))
  @UsePipes(new ValidationPipe())
  create(@Body() createTopicDto: CreateTopicDto, @User() user: UserEntity) {
    return this.topicService.create(createTopicDto, String(user._id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard(RoleEnum.ADMIN))
  @UsePipes(new ValidationPipe())
  updateOne(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() updateTopicDto: UpdateTopicDto,
    @User() user: UserEntity,
  ) {
    return this.topicService.updateOne(id, updateTopicDto, String(user._id));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.topicService.getAll();
  }
}
