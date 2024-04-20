import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ValidPhoneNumber } from '../validators/phoneNumber.validator';
import { ValidName } from '../validators/name.validator';

export class CreateContactDto {
  @IsNotEmpty()
  @ValidName()
  firstName: string;

  @ValidName()
  @IsOptional()
  lastName?: string;

  @IsNotEmpty()
  @IsString()
  @ValidPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
