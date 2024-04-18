import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { SortKeys, SortType } from '../enums/enums';

@Injectable()
export class SortByTransform implements PipeTransform<string> {
  transform(value: any, metadata: ArgumentMetadata): string {
    if (!value?.order) {
      value.order = { key: SortKeys.Id, type: SortType.asc };
      return value;
    }
    if (!value.order?.type) {
      value.order.type = SortType.asc;
    }
    if (!value.order?.key) {
      value.order.key = SortKeys.Id;
    }
    return value;
  }
}
