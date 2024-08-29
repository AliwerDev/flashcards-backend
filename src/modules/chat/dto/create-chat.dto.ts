import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  type: 'string';
}
