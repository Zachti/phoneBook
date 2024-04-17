import { IsString } from 'class-validator';

export class SearchContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
