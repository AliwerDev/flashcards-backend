import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BoxSearchQueryDto {
  @ApiProperty({
    example: 'true',
    description: 'Include card count in response',
  })
  @IsOptional()
  readonly withCardCount: boolean | string;
}
