import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ValidPhoneNumber } from '../validators/phoneNumber.validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ValidPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsBoolean()
  isFavorite: boolean = false;

  @IsBoolean()
  isBlocked: boolean = false;
}
