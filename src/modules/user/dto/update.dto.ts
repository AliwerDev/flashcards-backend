import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleEnum } from 'src/models/user.scheme';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class UpdateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: string;
}

class ChatDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

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

export class ConnectTgDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @Type(() => ChatDto)
  readonly chat: ChatDto;
}
