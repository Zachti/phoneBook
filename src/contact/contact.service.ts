import { NotFoundException, Injectable } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto, SearchContactDto } from './dto';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { SortKeys, SortType } from '../commons/enums/enums';
import { CacheService } from '../cache/cache.service';
import { ListDto } from '../commons/dto/list.dto';
import { paginationResponse } from './interfaces';
import { SortInput } from '../commons/dto/sort.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact, 'mysql')
    private mysqlRepository: Repository<Contact>,
    private readonly cacheManager: CacheService<Contact>,
    private readonly logger: LoggerService,
  ) {}
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    this.logger.debug(
      `trying to create new contact: ${JSON.stringify(createContactDto)}`,
    );
    const contact = await this.mysqlRepository.save({
      ...createContactDto,
      isBlocked: false,
    });
    this.logger.debug(`new contact created in the DB. 
      fullName: ${contact.firstName} ${contact.lastName}`);
    this.logger.info(`res: ${JSON.stringify(contact)}`);
    return contact;
  }

  async count(): Promise<number> {
    const count = await this.mysqlRepository.count();

    this.logger.info(`The sum of contacts in the DB is: ${count}`);
    return count;
  }

  async findAll(listDto: ListDto): Promise<paginationResponse> {
    const { skip = 0, take = 10, order = {} } = listDto;
    const contacts = await this.mysqlRepository.find();
    const sortedContacts = this.orderBy(contacts, order);
    return this.paginate(sortedContacts, skip, take);
  }

  async search(
    searchContactDto: SearchContactDto,
    listDto: ListDto,
  ): Promise<paginationResponse> {
    const { skip = 0, take = 10, order = {} } = listDto;
    const { firstName, lastName } = searchContactDto;
    let queryBuilder = this.mysqlRepository.createQueryBuilder('contacts');
    if (firstName) {
      queryBuilder = queryBuilder.where('contact.firstName LIKE :firstName', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      queryBuilder = queryBuilder.andWhere('contact.lastName LIKE :lastName', {
        lastName: `%${lastName}%`,
      });
    }
    const contacts = await queryBuilder.getMany();
    const sortedContacts = this.orderBy(contacts, order);
    return this.paginate(sortedContacts, skip, take);
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<UpdateContactDto> {
    this.logger.debug(`trying to update contact in DB. Contact id: ${id}`);
    await this.findOneOrFail(id);
    const updatedContact = await this.mysqlRepository.save(updateContactDto);
    await this.cacheManager.update(`${id}`, updatedContact);
    this.logger.debug(
      `contact updated in the DB. fullName: ${updatedContact.firstName} ${updatedContact.lastName}`,
    );
    return updateContactDto;
  }

  async remove(id: number): Promise<Contact> {
    const contact = await this.findOneOrFail(id);
    this.logger.debug(
      `trying to delete contact ${JSON.stringify(contact)} from DB.`,
    );
    const count = await this.mysqlRepository.remove(contact);
    await this.cacheManager.remove(`${id}`);
    this.logger.debug(
      `The number of contacts in the DB after contact name: ${contact.firstName} ${contact.lastName} deleted is: ${count}`,
    );
    return contact;
  }

  async findOneOrFail(id: number): Promise<Contact> {
    const key = `${id}`;
    const value = await this.cacheManager.get(key);
    if (value) return value;
    const contact = await this.mysqlRepository.findOneBy({ id });
    if (!contact) {
      this.logger.error(
        `Error: Contact with id [${id}] does not exists in the DB`,
      );
      throw new NotFoundException(
        `Error: Contact with the id [${id}] does not exists in the DB`,
      );
    }
    await this.cacheManager.set(key, contact);
    return contact;
  }

  async findMarkedContacts(
    isFavorite: boolean,
    listDto: ListDto,
  ): Promise<paginationResponse> {
    const { skip = 0, take = 10, order = {} } = listDto;
    const contacts = isFavorite
      ? await this.mysqlRepository.find({ where: { isFavorite: true } })
      : await this.mysqlRepository.find({ where: { isBlocked: true } });
    const sortedContacts = this.orderBy(contacts, order);
    return this.paginate(sortedContacts, skip, take);
  }

  private paginate(
    contacts: Contact[],
    skip: number,
    take: number,
  ): paginationResponse {
    const size = contacts.length;
    const totalContacts = size - skip;
    const totalPages = Math.ceil(totalContacts / take);

    const paginatedContacts: Contact[][] = [];

    for (let i = 0; i < totalPages; i++) {
      const startIndex = i * take + skip;
      const endIndex = Math.min(startIndex + take, size);
      const pageContacts = contacts.slice(startIndex, endIndex);
      paginatedContacts.push(pageContacts);
    }

    return { paginatedContacts, totalPages, totalContacts };
  }

  private orderBy(contacts: Contact[], sort: SortInput): Contact[] {
    const { key = SortKeys.Id, type = SortType.asc } = sort;
    const sortedContacts =
      contacts.sort((a, b) => {
        switch (key) {
          case SortKeys.FirstName:
            return a.firstName.localeCompare(b.firstName);
          case SortKeys.LastName:
            return a.lastName.localeCompare(b.lastName);
          case SortKeys.Id:
            return a.id - b.id;
        }
      })

    type === SortType.desc ? sortedContacts.reverse() : sortedContacts;
    return sortedContacts;
  }
}
