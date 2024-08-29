import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { CreateWordDto } from 'src/modules/word/dto/create-word.dto';

export class CreateCardDto extends CreateWordDto {
  @ApiProperty({
    description: 'The ID of the sub-topic the word belongs to',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly boxId: string;
}
