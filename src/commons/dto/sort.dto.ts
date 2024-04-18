import { SortKeys, SortType } from '../enums/enums';

export class SortInput {
  key?: SortKeys;

  type?: SortType = SortType.asc;
}
