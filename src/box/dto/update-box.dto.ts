// src/boxes/dto/update-box.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateBoxDto {
  @ApiPropertyOptional({
    description: 'The review interval in minutes',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly reviewInterval?: number;
}
