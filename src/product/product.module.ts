import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductScheme } from 'src/models/product.scheme';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductScheme }]),
    SharedModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
