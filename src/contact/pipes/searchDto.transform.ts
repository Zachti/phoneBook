import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { SearchContactDto } from '../dto';
import { SortKeys, SortType } from '../../commons/enums/enums';

@Injectable()
export class SearchDtoPipe implements PipeTransform<any, SearchContactDto> {
  transform(value: any, metadata: ArgumentMetadata): SearchContactDto {
    const { listDto, ...rest } = value;
    return {
      ...rest,
      listDto: {
        skip: listDto?.skip ?? 0,
        take: listDto?.take ?? 10,
        order: listDto?.order ?? {
          key: SortKeys.Id,
          type: SortType.asc,
        },
      },
    };
  }
}
