import { IsOptional } from 'class-validator';
import { SortInput } from './sort.dto';

export class ListDto {
  @IsOptional()
  skip?: number;

  @IsOptional()
  take?: number;

  @IsOptional()
  order?: SortInput;
}
