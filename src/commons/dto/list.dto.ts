import { IsOptional } from 'class-validator';
import { SortInput } from './sort.dto';
import { IsSortInput } from '../validators/isSortInput.validator';

export class ListDto {
  @IsOptional()
  skip?: number;

  @IsOptional()
  take?: number;

  @IsSortInput()
  @IsOptional()
  order?: SortInput;
}
