// src/cards/dto/update-card.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsMongoId } from 'class-validator';
import { UpdateWordDto } from 'src/modules/word/dto/update-word.dto';

export class UpdateCardDto extends UpdateWordDto {
  @ApiPropertyOptional({
    description: 'The ID of the box',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsOptional()
  readonly boxId?: string;
}
