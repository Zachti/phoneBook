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
    if (!value?.order?.key) return value;
    if (!Object.values(SortKeys).includes(value.order.key)) {
      throw new BadRequestException(
        `invalid sortBy! Allowed values: ${Object.values(SortKeys)}`,
      );
    }
    return value;
  }
}
