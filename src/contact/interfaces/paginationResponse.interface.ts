import { Contact } from '../entities/contact.entity';

export interface paginationResponseInterface {
  paginatedContacts: Contact[][];
  totalPages: number;
}
