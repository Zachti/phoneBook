import { Injectable } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto, SearchContactDto } from './dto';
import { Contact } from './entities/contact.entity';
import { FindManyOptions, Like } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { ListDto } from '../commons/dto/list.dto';
import { listResponse, paginationResponse } from './interfaces';
import { SortInput } from '../commons/dto/sort.dto';
import { ContactRepository } from './contact.repository';

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
    listDto: ListDto,
    pagination: boolean,
  ): Promise<paginationResponse | listResponse> {
    const { skip, take, order } = listDto;
    const findOptions = this.createFindOptions({}, order);
    const [contacts, count] = await this.repository.findAndCount(findOptions);
    return this.paginate(contacts, skip, take, count, pagination);
  }

  async search(
    searchContactDto: SearchContactDto,
    pagination: boolean,
  ): Promise<paginationResponse | listResponse> {
    const { firstName, lastName, listDto } = searchContactDto;

    const { skip, take, order } = listDto;

    const where = {
      ...(firstName && { firstName: Like(`%${firstName}%`) }),
      ...(lastName && { lastName: Like(`%${lastName}%`) }),
    };
    const findOptions = this.createFindOptions(where, order);
    const [contacts, count] = await this.repository.findAndCount(findOptions);
    return this.paginate(contacts, skip, take, count, pagination);
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
    listDto: ListDto,
    pagination: boolean,
  ): Promise<paginationResponse | listResponse> {
    const { skip, take, order } = listDto;
    const where = isFavorite ? { isFavorite } : { isBlocked: true };
    const findOptions = this.createFindOptions(where, order);
    const [contacts, count] = await this.repository.findAndCount(findOptions);
    return this.paginate(contacts, skip, take, count, pagination);
  }

  async findOneById(id: number): Promise<Contact> {
    return await this.repository.findOneOrThrow(id);
  }

  private paginate(
    contacts: Contact[],
    skip: number,
    take: number,
    count: number,
    pagination: boolean,
  ): paginationResponse | listResponse {
    if (!pagination) return { contacts, count };
    if (skip > count)
      return { paginatedContacts: [], totalPages: 0, totalContacts: 0 };
    const totalContacts = count - skip;
    const totalPages = Math.ceil(totalContacts / take);

    const paginatedContacts: Contact[][] = [];

    for (let i = 0; i < totalPages; i++) {
      const startIndex = i * take + skip;
      const endIndex = Math.min(startIndex + take, count);
      const pageContacts = contacts.slice(startIndex, endIndex);
      paginatedContacts.push(pageContacts);
    }

    return { paginatedContacts, totalPages, totalContacts };
  }

  private createFindOptions(
    where: any,
    order: SortInput,
  ): FindManyOptions<Contact> {
    return {
      order: { [order.key]: order.type },
      where,
    };
  }
}
