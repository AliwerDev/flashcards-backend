// src/boxes/dto/create-box.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Vocabulary' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  readonly title: string;
}
