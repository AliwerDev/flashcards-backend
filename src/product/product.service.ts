import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryProductDto } from './dto/query.product.dto';
import { Product } from '../types/product';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(
    productDTO: CreateProductDTO,
    image: Express.Multer.File,
  ): Promise<Product> {
    productDTO.image = image.filename;
    return await this.productModel.create(productDTO);
  }

  async findAll(query: QueryProductDto): Promise<Product[]> {
    const queryObject = query.search
      ? {
          title: { $regex: query.search, $options: 'i' },
          description: { $regex: query.search, $options: 'i' },
        }
      : {};

    const limit = Number(query.limit || 10);
    const page = Number(query.page || 1);
    const skip = (page - 1) * limit;

    return await this.productModel
      .find(queryObject)
      .populate('owner', '-password')
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async findOne(id: string) {
    return await this.productModel.findById(id).populate('owner', '-password');
  }

  async update(
    id: string,
    productDTO: UpdateProductDTO,
    image: Express.Multer.File,
  ) {
    const product = await this.productModel.findById(id);
    if (image) {
      fs.unlink(`${__dirname}/../../files/${product.image}`, async (err) => {
        if (err) new HttpException('File is not found', HttpStatus.NOT_FOUND);

        productDTO.image = image.filename;
        return await product.updateOne(productDTO);
      });
    }
    return await product.updateOne(productDTO);
  }

  async remove(id: string) {
    return await this.productModel.deleteOne({ _id: id });
  }
}
