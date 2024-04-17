import { SortInput } from './sort.dto';

export class ListDto {
  skip?: number = 0;

  take?: number = 10;

  order?: SortInput;
}
