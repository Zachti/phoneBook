import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { SortInput } from './sort.dto';
import { Type } from 'class-transformer';

export class ListDto {
  @IsNumber()
  @IsOptional()
  skip?: number;

  @IsNumber()
  @IsOptional()
  take?: number;

  @ValidateNested()
  @Type(() => SortInput)
  @IsOptional()
  order?: SortInput;
}
