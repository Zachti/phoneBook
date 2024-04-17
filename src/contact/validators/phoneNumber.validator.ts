import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'dateNotInPast', async: false })
export class ValidatePhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(value: number): boolean {
    if (!value) {
      throw new BadRequestException('Phone number is required.');
    }

    const phoneNumber = value.toString();

    if (phoneNumber.startsWith('+')) {
      if (phoneNumber.length !== 13) {
        throw new BadRequestException(
          'Phone number starting with "+" should be 13 characters long.',
        );
      }
    } else if (phoneNumber.startsWith('0')) {
      if (phoneNumber.length !== 10) {
        throw new BadRequestException(
          'Phone number starting with "0" should be 10 characters long.',
        );
      }
    } else {
      throw new BadRequestException(
        'Invalid phone number format. It should start with "+" or "0".',
      );
    }

    return true;
  }
}

export function ValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidatePhoneNumberConstraint,
    });
  };
}
