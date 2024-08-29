import { IsOptional, IsMongoId, IsString } from 'class-validator';

export class FilterQueryDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;
}
