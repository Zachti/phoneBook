import { Contact } from '../entities/contact.entity';

export interface paginationResponse {
  paginatedContacts: Contact[][];
  totalPages: number;
}
