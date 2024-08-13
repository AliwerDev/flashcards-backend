// src/cards/dto/create-card.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @ApiProperty({
    description: 'The front side of the flashcard',
    example: 'Hello',
  })
  @IsString()
  @IsNotEmpty()
  readonly front: string;

  @ApiProperty({
    description: 'The back side of the flashcard',
    example: 'Hola',
  })
  @IsString()
  @IsNotEmpty()
  readonly back: string;

  @ApiProperty({
    description: 'The ID of the box',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly boxId: string;
}

class CardDto {
  @ApiProperty({
    description: 'The front side of the flashcard',
    example: 'Hello',
  })
  @IsString()
  @IsNotEmpty()
  front: string;

  @ApiProperty({
    description: 'The back side of the flashcard',
    example: 'Hola',
  })
  @IsString()
  @IsNotEmpty()
  back: string;
}
export class CreateCardsDto {
  @ApiProperty({
    description: 'The ID of the box',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly boxId: string;

  @ApiProperty({
    description: 'The list of flashcards to create',
    type: [CardDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  readonly cards: CardDto[];
}
