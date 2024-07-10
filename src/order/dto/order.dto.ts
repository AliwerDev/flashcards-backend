import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Product {
  @ApiProperty({ type: String, description: 'Product Id' })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ type: Number, description: 'Quantity' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class OrderDTO {
  @ApiProperty({ type: String, description: 'Owner Id' })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ type: Number, description: 'Total Price' })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ type: Product, description: 'Purchased product' })
  @ValidateNested()
  @Type(() => Product)
  product: Product;
}
