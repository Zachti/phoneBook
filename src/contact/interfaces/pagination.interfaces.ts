import { Contact } from '../entities/contact.entity';

export interface PaginationResponse {
  paginatedContacts: Contact[][];
  totalPages: number;
  totalContacts: number;
}

export interface PaginationInput {
  totalContacts: number;
  totalPages: number;
  skip: number;
  take: number;
  count: number;
}
