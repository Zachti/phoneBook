import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidPhoneNumber', async: false })
export class ValidatePhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    if (value.startsWith('+')) {
      if (value.length !== 13) {
        throw new BadRequestException(
          'Phone number starting with "+" should be 13 characters long.',
        );
      }
    } else if (value.startsWith('0')) {
      if (value.length !== 10) {
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
