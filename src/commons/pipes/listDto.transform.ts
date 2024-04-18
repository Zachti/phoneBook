import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ListDto } from '../dto/list.dto';

@Injectable()
export class ListDtoPipe implements PipeTransform<any, ListDto> {
  transform(value: any, metadata: ArgumentMetadata): ListDto {
    return {
      skip: value?.skip ?? 0,
      take: value?.take ?? 10,
      order: value?.order ?? {},
    };
  }
}
