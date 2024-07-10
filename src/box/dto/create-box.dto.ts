// src/boxes/dto/create-box.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateBoxDto {
  userId: string;

  @ApiProperty({ description: 'The review interval in minutes', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  readonly reviewInterval: number;
}
