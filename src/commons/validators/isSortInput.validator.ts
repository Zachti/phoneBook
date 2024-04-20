import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SortKeys, SortType } from '../enums/enums';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

@ValidatorConstraint({ name: 'isSortInput', async: false })
export class IsSortInputConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value.key && value.type) {
      return (
        Object.values(SortKeys).includes(value.key) &&
        Object.values(SortType).includes(value.type)
      );
    } else if (value.key) {
      return Object.values(SortKeys).includes(value.key);
    } else {
      return Object.values(SortType).includes(value.type);
    }
  }
  defaultMessage(validationArguments?: ValidationArguments) {
    return `${validationArguments.property} must be a valid SortInput object.`;
  }
}

export function IsSortInput(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSortInputConstraint,
    });
  };
}
