import { IsString } from 'class-validator';
import { ValidName } from '../validators/name.validator';

export class SearchContactDto {
  @IsString()
  @ValidName()
  firstName: string;

  @IsString()
  @ValidName()
  lastName: string;
}
