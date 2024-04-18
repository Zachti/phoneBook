import { SortInput } from './sort.dto';

export class ListDto {
  skip?: number;

  take?: number;

  order?: SortInput;
}
