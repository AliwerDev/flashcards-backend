import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class FilterQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsMongoId()
  boxId?: string;
}
