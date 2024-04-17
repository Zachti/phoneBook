import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidName', async: false })
export class ValidateNameConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const regex = /^[a-zA-Z\s']+$/;

    if (!regex.test(value)) {
      throw new BadRequestException(
        'Invalid name format. Name should contain only letters and spaces.',
      );
    }

    return true;
  }
}

export function ValidName(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateNameConstraint,
    });
  };
}
