import { IsEnum, IsOptional } from 'class-validator';
import { SortKeys, SortType } from '../enums/enums';

export class SortInput {
  @IsEnum(SortType)
  @IsOptional()
  key?: SortKeys;

  @IsEnum(SortType)
  @IsOptional()
  type?: SortType;
}
