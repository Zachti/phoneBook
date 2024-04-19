import { BadRequestException, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ContactRepository } from '../contact.repository';

@ValidatorConstraint({ name: 'ValidPhoneNumber', async: true })
@Injectable()
export class ValidatePhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly repository: ContactRepository) {}

  async validate(value: string): Promise<boolean> {
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

    const contact = await this.repository.findOneBy({ phoneNumber: value });
    if (contact) {
      throw new BadRequestException('Phone number already exists.');
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
