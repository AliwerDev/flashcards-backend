import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/models/category.scheme';
import { Model } from 'mongoose';
import { BoxService } from 'src/box/box.service';
import { createUrlFromTitle } from 'src/utils/functions';
import { CardService } from 'src/card/card.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    readonly boxService: BoxService,
    readonly cardService: CardService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    const categories = await this.categoryModel.find({ userId });

    if (categories.length >= 5) {
      throw new HttpException(
        'Maximum number of categories reached',
        HttpStatus.FORBIDDEN,
      );
    }

    const category = {
      title: createCategoryDto.title,
      url: createUrlFromTitle(createCategoryDto.title),
      userId,
    };
    const newCategory = new this.categoryModel(category);

    await this.boxService.createDefaultBoxes(String(newCategory._id), userId);
    return await newCategory.save();
  }

  async findAll(userId: string) {
    const categories = await this.categoryModel.find({ userId });
    return categories;
  }

  async findOne(id: string, userId: string) {
    const category = await this.categoryModel.findOne({ userId, _id: id });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    const category = await this.categoryModel.findOne({ userId, _id: id });

    if (!category) {
      throw new HttpException('Categories not found', HttpStatus.NOT_FOUND);
    }

    category.title = updateCategoryDto.title;
    category.url = createUrlFromTitle(category.title);

    return await category.save();
  }

  async remove(id: string, userId: string) {
    const categories = await this.categoryModel.find({ userId });
    if (categories.length === 1) {
      throw new HttpException(
        'Cannot delete the last category',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.boxService.deleteMany(id);
    await this.cardService.deleteMany(id);
    await this.categoryModel.deleteOne({ userId, _id: id });

    return `This action removes a #${id} category and all related cards and boxes`;
  }
}
