import { Injectable } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto, SearchContactDto } from './dto';
import { Contact } from './entities/contact.entity';
import { FindManyOptions, Like } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { ListDto } from '../commons/dto/list.dto';
import {
  GenerateResponseInput,
  listResponse,
  PaginationInput,
  PaginationResponse,
} from './interfaces';
import { SortInput } from '../commons/dto/sort.dto';
import { ContactRepository } from './contact.repository';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class ContactService {
  constructor(
    private repository: ContactRepository,
    private readonly logger: LoggerService,
  ) {}
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    this.logger.debug(
      `trying to create new contact: ${JSON.stringify(createContactDto)}`,
    );
    const contact = await this.repository.save(createContactDto);
    this.logger.debug(`new contact created in the DB. 
      fullName: ${contact.firstName} ${contact.lastName}`);
    this.logger.info(`res: ${JSON.stringify(contact)}`);
    return contact;
  }

  async count(): Promise<number> {
    const count = await this.repository.count();

    this.logger.info(`The sum of contacts in the DB is: ${count}`);
    return count;
  }

  async findAll(
    { skip, take, order }: ListDto,
    pagination: boolean,
  ): Promise<PaginationResponse | listResponse> {
    const findOptions = this.createFindOptions({}, order);
    const [contacts, count] = await this.repository.findAndCount(findOptions);
    return this.generateResponse(contacts, { pagination, skip, take, count });
  }

  async search(
    searchContactDto: SearchContactDto,
    pagination: boolean,
  ): Promise<PaginationResponse | listResponse> {
    const { firstName, lastName, listDto } = searchContactDto;

    const { skip, take, order } = listDto;

    const where = {
      ...(firstName && { firstName: Like(`%${firstName}%`) }),
      ...(lastName && { lastName: Like(`%${lastName}%`) }),
    };
    const findOptions = this.createFindOptions(where, order);
    const [contacts, count] = await this.repository.findAndCount(findOptions);
    return this.generateResponse(contacts, { pagination, skip, take, count });
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<UpdateContactDto> {
    return await this.repository.updateWithCache(id, updateContactDto);
  }

  async remove(id: number): Promise<Contact> {
    return await this.repository.removeWithCache(id);
  }

  async findMarkedContacts(
    isFavorite: boolean,
    { skip, take, order }: ListDto,
    pagination: boolean,
  ): Promise<PaginationResponse | listResponse> {
    const where = isFavorite ? { isFavorite } : { isBlocked: true };
    const findOptions = this.createFindOptions(where, order);
    const [contacts, count] = await this.repository.findAndCount(findOptions);
    return this.generateResponse(contacts, { pagination, skip, take, count });
  }

  async findOneById(id: number): Promise<Contact> {
    return await this.repository.findOneOrThrow(id);
  }

  private createFindOptions(
    where: FindOptionsWhere<Contact>[] | FindOptionsWhere<Contact>,
    order: SortInput,
  ): FindManyOptions<Contact> {
    return {
      order: { [order.key]: order.type },
      where,
    };
  }

  private generateResponse(
    contacts: Contact[],
    input: GenerateResponseInput,
  ): PaginationResponse | listResponse {
    const { pagination, skip, count } = input;

    if (!pagination) {
      return skip > count
        ? { contacts: [], count: 0 }
        : {
            contacts: contacts.slice(skip),
            count: count - skip,
          };
    }
    return skip > count
      ? { paginatedContacts: [], totalPages: 0, totalContacts: 0 }
      : this.paginate(contacts, this.generatePaginationInfo(input));
  }

  private generatePaginationInfo({ skip, take, count }: GenerateResponseInput) {
    const totalContacts = count - skip;
    const totalPages = Math.ceil(totalContacts / take);
    return { totalContacts, totalPages, skip, take, count };
  }

  private paginate(
    contacts: Contact[],
    { totalContacts, totalPages, skip, take, count }: PaginationInput,
  ): PaginationResponse | listResponse {
    const paginatedContacts: Contact[][] = [];

    for (let i = 0; i < totalPages; i++) {
      const startIndex = i * take + skip;
      const endIndex = Math.min(startIndex + take, count);
      const pageContacts = contacts.slice(startIndex, endIndex);
      paginatedContacts.push(pageContacts);
    }

    return { paginatedContacts, totalPages, totalContacts };
  }
}
