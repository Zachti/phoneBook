import { NotFoundException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchContactDto } from './dto/search-contact.dto';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { SortByTypes } from './enums/enums';
import { CacheService } from '../cache/cache.service';

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

  async findAll(sortBy: SortByTypes): Promise<Contact[]> {
    const contacts = await this.mysqlRepository.find();
    return sortBy
      ? contacts.sort((a, b) => {
          switch (sortBy.toUpperCase()) {
            case SortByTypes.FirstName:
              return a.firstName.localeCompare(b.firstName);
            case SortByTypes.LastName:
              return a.lastName.localeCompare(b.lastName);
            case SortByTypes.Id:
              return a.id - b.id;
          }
        })
      : contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
    // todo add pagination
  }

  async search(searchContactDto: SearchContactDto): Promise<Contact[]> {
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

    return await queryBuilder.getMany();
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

  async findAllFavorites(): Promise<Contact[]> {
    return await this.mysqlRepository.find({ where: { isFavorite: true } });
  }
}
