// src/cards/dto/update-card.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class UpdateCardDto {
  @ApiPropertyOptional({
    description: 'The front side of the flashcard',
    example: 'Hello',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly front?: string;

  @ApiPropertyOptional({
    description: 'The back side of the flashcard',
    example: 'Hola',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly back?: string;

  @ApiPropertyOptional({
    description: 'The ID of the box',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsOptional()
  readonly boxId?: string;
}
