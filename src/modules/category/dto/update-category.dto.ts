// src/boxes/dto/create-box.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Category name', example: '' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  readonly title: string;
}
