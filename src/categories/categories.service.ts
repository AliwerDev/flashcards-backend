import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/models/category.scheme';
import { Model } from 'mongoose';
import { BoxService } from 'src/box/box.service';
import { createCacheKey } from 'src/utils/functions';
import { CardService } from 'src/card/card.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    readonly boxService: BoxService,
    readonly cardService: CardService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    const cacheKey = createCacheKey.categories(userId);
    const categories = await this.categoryModel.find({ userId });

    if (categories.length >= 7) {
      throw new HttpException(
        'Maximum number of categories reached',
        HttpStatus.FORBIDDEN,
      );
    }

    const categoryDto = {
      title: createCategoryDto.title,
      userId,
    };
    const category = new this.categoryModel(categoryDto);

    await this.boxService.createDefaultBoxes(String(category._id), userId);
    this.cacheManager.set(cacheKey, [...categories, category]);
    return category.save();
  }

  async findAll(userId: string) {
    const cacheKey = createCacheKey.categories(userId);
    let categories: any = await this.cacheManager.get(cacheKey);

    if (!categories) {
      categories = await this.categoryModel.find({ userId });
      this.cacheManager.set(cacheKey, categories);
    }

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
    const cacheKey = createCacheKey.categories(userId);
    const category = await this.categoryModel.findOne({ userId, _id: id });

    if (!category) {
      throw new HttpException('Categories not found', HttpStatus.NOT_FOUND);
    }

    category.title = updateCategoryDto.title;

    await this.cacheManager.del(cacheKey);
    return await category.save();
  }

  async remove(id: string, userId: string) {
    const cacheKey = createCacheKey.categories(userId);
    const categories = await this.categoryModel.find({ userId });

    if (categories.length === 1) {
      throw new HttpException(
        'Cannot delete the last category',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.categoryModel.deleteOne({ userId, _id: id });
    await this.cacheManager.del(cacheKey);
    await this.boxService.deleteMany(id);
    await this.cardService.deleteByCategory(id);

    return `This action removes a #${id} category and all related cards and boxes`;
  }
}
