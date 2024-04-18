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
  @IsString()
  @ValidName()
  firstName: string;

  @IsOptional()
  @IsString()
  @ValidName()
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
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
