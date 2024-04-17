import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  // todo isValidPhoneNumber
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsBoolean()
  isFavorite: boolean;
}
