import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

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

export class GithubLoginDto {
  @ApiProperty()
  @IsString()
  code: string;
}
