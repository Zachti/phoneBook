import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { SortKeys } from '../enums/enums';

@Injectable()
export class SortByTypeValidator implements PipeTransform<string> {
  transform(value: any, metadata: ArgumentMetadata): string {
    if (!value || !value.order) return value;
    if (!Object.values(SortKeys).includes(value.order)) {
      throw new BadRequestException(
        `invalid sortBy! \nAllowed values: ${Object.values(SortKeys)}`,
      );
    }
    return value;
  }
}
