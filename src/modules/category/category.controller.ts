import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User as UserEntity } from 'src/models/user.scheme';
import { User } from 'src/decorators/user.decorator';
import { CategoryService } from './category.service';
import { ValidateMongoIdPipe } from 'src/pipes/mongo-id.pipe';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: UserEntity,
  ) {
    return this.categoryService.create(createCategoryDto, String(user._id));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@User() user: UserEntity) {
    return this.categoryService.findAll(String(user._id));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Param('id', ValidateMongoIdPipe) id: string,
    @User() user: UserEntity,
  ) {
    return this.categoryService.findOne(id, String(user._id));
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: UserEntity,
  ) {
    return this.categoryService.update(id, updateCategoryDto, String(user._id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id', ValidateMongoIdPipe) id: string,
    @User() user: UserEntity,
  ) {
    return this.categoryService.remove(id, String(user._id));
  }
}
