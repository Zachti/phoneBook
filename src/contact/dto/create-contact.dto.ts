import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ValidPhoneNumber } from '../validators/phoneNumber.validator';
import { ValidName } from '../validators/name.validator';
import { IsImageUrl } from '../validators/isImageUrl.validator';

export class CreateContactDto {
  @ValidName()
  @IsNotEmpty()
  firstName: string;

  @ValidName()
  @IsOptional()
  lastName?: string;

  @ValidPhoneNumber()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;

  @IsImageUrl()
  @IsOptional()
  imageUrl?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
