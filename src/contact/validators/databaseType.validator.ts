import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { DatabaseTypes } from '../enums/enums';

@Injectable()
export class DatabaseTypesValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (!Object.values(DatabaseTypes).includes(value)) {
      throw new BadRequestException('Error: invalid DB!');
    }
    return value;
  }
}
