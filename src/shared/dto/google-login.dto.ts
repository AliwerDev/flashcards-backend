import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  credential: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  access_token: string;
}
