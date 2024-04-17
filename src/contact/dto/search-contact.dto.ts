import { IsNotEmpty, IsString } from 'class-validator';

export class SearchContactDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
