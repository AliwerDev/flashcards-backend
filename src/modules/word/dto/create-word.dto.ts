import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsMongoId } from 'class-validator';
import { WordDto } from './word.dto';

export class CreateWordDto extends WordDto {
  @ApiProperty({
    description: 'The ID of the sub-topic the word belongs to',
    example: '60c72b2f9b1d8e35b8f06f88',
  })
  @IsMongoId()
  @IsOptional()
  subTopicId: string;
}
