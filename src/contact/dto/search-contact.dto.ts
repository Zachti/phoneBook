import { IsOptional, ValidateNested } from 'class-validator';
import { ValidName } from '../validators/name.validator';
import { ListDto } from '../../commons/dto/list.dto';
import { Type } from 'class-transformer';

export class SearchContactDto {
  @ValidName()
  @IsOptional()
  firstName?: string;

  @ValidName()
  @IsOptional()
  lastName?: string;

  @ValidateNested()
  @Type(() => ListDto)
  @IsOptional()
  listDto?: ListDto;
}
