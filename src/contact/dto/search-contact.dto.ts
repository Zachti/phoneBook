import { IsOptional } from 'class-validator';
import { ValidName } from '../validators/name.validator';
import { ListDto } from '../../commons/dto/list.dto';

export class SearchContactDto {
  @ValidName()
  firstName?: string;

  @ValidName()
  lastName?: string;

  @IsOptional()
  listDto?: ListDto;
}
