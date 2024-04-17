import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ValidPhoneNumber } from '../validators/phoneNumber.validator';
import { ValidName } from '../validators/name.validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @ValidName()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ValidName()
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
