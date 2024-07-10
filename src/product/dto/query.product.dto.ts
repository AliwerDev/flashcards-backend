import { ApiProperty } from '@nestjs/swagger';

export class QueryProductDto {
  @ApiProperty({
    type: String,
    description: 'To search products by title and description',
  })
  search: string;

  @ApiProperty({
    type: Number,
    description: 'Current page number',
  })
  limit: number;

  @ApiProperty({
    type: Number,
    description: 'Limit of products per page',
  })
  page: number;
}
