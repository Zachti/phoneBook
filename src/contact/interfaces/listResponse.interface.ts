import { Contact } from '../entities/contact.entity';

export interface listResponse {
  contacts: Contact[];
  count: number;
}
