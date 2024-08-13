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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User as UserEntity } from 'src/models/user.scheme';
import { User } from 'src/decorators/user.decorator';

@ApiTags('Category')
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: UserEntity,
  ) {
    return this.categoriesService.create(createCategoryDto, String(user._id));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@User() user: UserEntity) {
    return this.categoriesService.findAll(String(user._id));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.categoriesService.findOne(id, String(user._id));
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: UserEntity,
  ) {
    return this.categoriesService.update(
      id,
      updateCategoryDto,
      String(user._id),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @User() user: UserEntity) {
    return this.categoriesService.remove(id, String(user._id));
  }
}
