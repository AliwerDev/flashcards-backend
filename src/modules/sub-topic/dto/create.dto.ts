// src/cards/dto/create-topic.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateSubTopicDto {
  @ApiProperty({
    example: 'Health and Fitness',
    description: 'The name of the topic',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

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
    description: 'The ID of the parent topic',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly parentId: string;
}
