import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export default class DeleteCardsDto {
  @ApiProperty({
    description: 'The list of MongoDB ObjectIds representing the cards',
    type: [String],
    example: ['60d9f4b4d1c4a23a3c8f4b5e', '60d9f4b4d1c4a23a3c8f4b5f'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsMongoId({ each: true })
  readonly ids: string[];
}
