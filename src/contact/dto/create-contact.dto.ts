import { IsBoolean, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ValidPhoneNumber } from '../validators/phoneNumber.validator';
import { ValidName } from '../validators/name.validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @ValidName()
  firstName: string;

  @IsString()
  @ValidName()
  lastName?: string;

  @IsNotEmpty()
  @IsString()
  @ValidPhoneNumber()
  phoneNumber: string;

  @IsString()
  address?: string;

  @IsBoolean()
  isFavorite?: boolean;

  @IsUrl()
  imageUrl?: string;
}
