import { NotFoundException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchContactDto } from './dto/search-contact.dto';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { SortKeys } from '../commons/enums/enums';
import { CacheService } from '../cache/cache.service';
import { ListDto } from '../commons/dto/list.dto';
import { listResponse } from './interfaces/listResponse.interface';
import { paginationResponse } from './interfaces/pagination.response';

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
    const id =
      (await this.mysqlRepository
        .createQueryBuilder('contacts')
        .select('MAX(contacts.id)', 'max')
        .getRawOne()) + 1;
    const contact = { id, ...createContactDto };
    await this.mysqlRepository.save(contact);
    this.logger.debug(`new contact created in the DBs. 
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
    const { skip, take, order } = listDto;
    const contacts = await this.mysqlRepository.find();
    const sortedContacts = order
      ? contacts.sort((a, b) => {
          switch (order.key.toUpperCase()) {
            case SortKeys.FirstName:
              return a.firstName.localeCompare(b.firstName);
            case SortKeys.LastName:
              return a.lastName.localeCompare(b.lastName);
            case SortKeys.Id:
              return a.id - b.id;
          }
        })
      : contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));

    return this.paginate(sortedContacts, skip, take);
  }

  async search(searchContactDto: SearchContactDto): Promise<listResponse> {
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
    return { contacts, count: contacts.length };
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<UpdateContactDto> {
    const contact = await this.findOneOrFail(id);
    await this.mysqlRepository.update(id, updateContactDto);
    await this.cacheManager.remove(`${id}`);
    this.logger.debug(
      `contact updated in the DBs. fullName: ${contact.firstName} ${contact.lastName}`,
    );
    return updateContactDto;
  }

  async remove(id: number): Promise<Contact> {
    const contact = await this.findOneOrFail(id);
    this.logger.debug(`trying to delete contact ${JSON.stringify(contact)}`);
    const count = await this.mysqlRepository.remove(contact);
    await this.cacheManager.remove(`${id}`);
    this.logger.debug(
      `The number of contacts in the DBs after contact name: ${contact.firstName} ${contact.lastName} deleted is: ${count}`,
    );
    return contact;
  }

  async findOneOrFail(id: number): Promise<Contact> {
    const key = `${id}`;
    const value = await this.cacheManager.get(key);
    if (value) return value;
    const contact = await this.mysqlRepository.findOneByOrFail({ id });
    if (!contact) {
      this.logger.error(`Error: Contact with id [${id}] not exists in the DB`);
      throw new NotFoundException(
        `Error: Contact with the name [${id}] not exists in the DB`,
      );
    }
    await this.cacheManager.set(key, contact);
    return contact;
  }

  async findMarkedContacts(isFavorite: boolean): Promise<listResponse> {
    const contacts = isFavorite
      ? await this.mysqlRepository.find({ where: { isFavorite: true } })
      : await this.mysqlRepository.find({ where: { isBlocked: true } });
    return { contacts, count: contacts.length };
  }

  private paginate(
    contacts: Contact[],
    skip: number,
    take: number,
  ): paginationResponse {
    const totalContacts = contacts.length;
    const totalPages = Math.ceil(totalContacts / take);

    const paginatedContacts: Contact[][] = [];

    for (let i = 0; i < totalPages; i++) {
      const startIndex = i * take + skip;
      const endIndex = Math.min(startIndex + take, totalContacts);
      const pageContacts = contacts.slice(startIndex, endIndex);
      paginatedContacts.push(pageContacts);
    }

    return { paginatedContacts, totalPages };
  }
}
