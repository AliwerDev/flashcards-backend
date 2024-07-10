// src/cards/dto/create-card.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateCardDto {
  userId: string;

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
