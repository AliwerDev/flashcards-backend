import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class WordDto {
  @ApiProperty({
    description: 'The word or phrase to add',
    example: 'Apple',
  })
  @IsString()
  @IsNotEmpty()
  word: string;

  @ApiProperty({
    description: 'The translation of the word in another language',
    example: 'Olma',
  })
  @IsString()
  @IsNotEmpty()
  translation: string;

  @ApiProperty({
    description: 'List of examples using the word',
    example: ['An apple a day keeps the doctor away.'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  examples: string[];

  @ApiProperty({
    description: 'List of synonyms for the word',
    example: ['Fruit'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  synonyms: string[];

  @ApiProperty({
    description: 'The definition of the word',
    example:
      'A round fruit with sweet red or green flesh and a hard seed at the center.',
  })
  @IsString()
  @IsOptional()
  definition: string;
}
