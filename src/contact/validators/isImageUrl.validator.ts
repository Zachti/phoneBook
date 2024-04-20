import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsImageUrl(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isImageUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
          const imageExtensionsRegex = /\.(jpeg|jpg|png)$/i;
          return urlRegex.test(value) && imageExtensionsRegex.test(value);
        },
        defaultMessage() {
          return `imageUrl must be a valid URL string ending with .jpeg, .jpg, or .png.`;
        },
      },
    });
  };
}
