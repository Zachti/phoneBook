import {
  NotFoundException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchContactDto } from './dto/search-contact.dto';
import { Contacts } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { DatabaseTypes, SortByTypes } from './enums/enums';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contacts, 'mongodb')
    private mongoRepository: Repository<Contacts>,
    @InjectRepository(Contacts, 'mysql')
    private mysqlRepository: Repository<Contacts>,
    private readonly logger: LoggerService,
  ) {}
  async create(createContactDto: CreateContactDto) {
    try {
      this.logger.debug(
        `trying to create new contact: ${JSON.stringify(createContactDto)}`,
      );
      const newContact = await this.mysqlRepository.save(createContactDto);

      await this.mongoRepository.save(createContactDto);

      this.logger.debug(`new contact created in the DBs. 
      fullName: ${newContact.firstName} ${newContact.lastName}`);
      this.logger.info(`res: ${JSON.stringify(newContact)}`);
      return newContact;
    } catch (e) {
      this.logAndThrowInternalServerException(e);
    }
  }

  async count(database: DatabaseTypes) {
    try {
      const repository = this.getDbConnection(database);

      const count = await repository.count();

      this.logger.info(`The sum of contacts in ${database} DB is: ${count}`);
      return count;
    } catch (e) {
      this.logAndThrowInternalServerException(e);
    }
  }

  async findAll(database: DatabaseTypes, sortBy: SortByTypes) {
    const repository = this.getDbConnection(database);
    const contacts = await repository.find();
    return sortBy
      ? contacts.sort((a, b) => {
          switch (sortBy.toUpperCase()) {
            case SortByTypes.FirstName:
              return a.firstName.localeCompare(b.firstName);
            case SortByTypes.LastName:
              return a.lastName.localeCompare(b.lastName);
            case SortByTypes.PhoneNumber:
              return a.phoneNumber.localeCompare(b.phoneNumber);
          }
        })
      : contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
    // todo add pagination
  }

  async search(searchContactDto: SearchContactDto, database: DatabaseTypes) {
    const { firstName, lastName } = searchContactDto;
    const repository = this.getDbConnection(database);
    let queryBuilder = repository.createQueryBuilder('contacts');
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

  async update(updateContactDto: UpdateContactDto) {
    const searchParams = {
      firstName: updateContactDto.firstName,
      lastName: updateContactDto.lastName,
    };
    const contact = await this.checkIfContactExist(searchParams);
    try {
      await this.mysqlRepository.update(searchParams, updateContactDto);
      await this.mongoRepository.update(searchParams, updateContactDto);
      this.logger.debug(
        `contact updated in the DBs. fullName: ${contact.firstName} ${contact.lastName}`,
      );
      return updateContactDto;
    } catch (e) {
      this.logAndThrowInternalServerException(e);
    }
  }

  async remove(searchContactDto: SearchContactDto) {
    const contact = await this.checkIfContactExist(searchContactDto);
    try {
      this.logger.debug(
        `trying to delete contact ${JSON.stringify(searchContactDto)}`,
      );
      await this.mysqlRepository.remove(contact);
      await this.mongoRepository.remove(contact);
      const count = await this.mongoRepository.count();
      this.logger.debug(
        `The number of contacts in the DBs after contact name: ${searchContactDto.firstName} ${searchContactDto.lastName} deleted is: ${count}`,
      );
      return contact;
    } catch (e) {
      this.logAndThrowInternalServerException(e);
    }
  }

  private getDbConnection(database: DatabaseTypes): Repository<Contacts> {
    return database === 'MONGO' ? this.mongoRepository : this.mysqlRepository;
  }

  private logAndThrowInternalServerException(e: any) {
    this.logger.error('Could not connect to at least one DB.');
    throw new InternalServerErrorException(
      'Could not connect to at least one DB.',
      e,
    );
  }

  private async checkIfContactExist(searchContactDto: SearchContactDto) {
    const { firstName, lastName } = searchContactDto;
    const contact = await this.mysqlRepository.findOneBy({
      firstName,
      lastName,
    });
    const mongoContact = await this.mongoRepository.findOneBy({
      firstName,
      lastName,
    });
    if (!(contact && mongoContact)) {
      this.logger.error(
        `Error: Contact with the name [${firstName} ${lastName}] not exists in the DB`,
      );
      throw new NotFoundException(
        `Error: Contact with the name [${firstName} ${lastName}] not exists in the DB`,
      );
    }
    return contact;
  }
}
