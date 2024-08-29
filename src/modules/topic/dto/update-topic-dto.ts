// src/cards/dto/create-topic.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TypeEnum } from 'src/models/topic.scheme';

export class UpdateTopicDto {
  @ApiProperty({
    example: 'Health and Fitness',
    description: 'The name of the topic',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: 'Information related to maintaining good health and fitness',
    description: 'A brief description of what the topic covers',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL to an image representing the topic',
    required: false,
  })
  @IsOptional()
  @IsString()
  imgUrl?: string;

  @ApiProperty({
    example: TypeEnum.BOOK,
    description: 'The type of the topic',
    enum: TypeEnum,
  })
  @IsEnum(TypeEnum)
  @IsOptional()
  type: TypeEnum;
}
