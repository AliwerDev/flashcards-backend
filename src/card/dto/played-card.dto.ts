import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsBoolean } from 'class-validator';

export class PlayedCardDto {
  @ApiProperty({
    description: 'The ID of the card',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly cardId: string;

  @ApiProperty({
    description: 'Could you remember this card or not?',
    example: true,
  })
  @IsBoolean()
  readonly correct: string;
}
