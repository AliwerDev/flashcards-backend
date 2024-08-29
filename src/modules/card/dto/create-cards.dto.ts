import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateWordDto } from 'src/modules/word/dto/create-word.dto';

export class CreateCardsDto {
  @ApiProperty({
    description: 'The ID of the box',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly boxId: string;

  @ApiProperty({
    description: 'The list of words to create',
    type: [CreateWordDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWordDto)
  readonly words: CreateWordDto[];
}
