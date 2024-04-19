import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { LoggerService } from '../logger/logger.service';
import { CacheService } from '../cache/cache.service';
import { UpdateContactDto } from './dto';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ContactRepository extends Repository<Contact> {
  constructor(
    @InjectDataSource('mysql')
    private dataSource: DataSource,
    private readonly logger: LoggerService,
    private readonly cacheManager: CacheService<Contact>,
  ) {
    super(Contact, dataSource.createEntityManager());
  }

  async findOneOrThrow(id: number): Promise<Contact> {
    const key = `${id}`;
    const value = await this.cacheManager.get(key);
    if (value) return value;
    const contact = await super.findOneBy({ id });
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

  async removeWithCache(id: number): Promise<Contact> {
    const contact = await this.findOneOrThrow(id);
    this.logger.debug(
      `trying to delete contact ${JSON.stringify(contact)} from DB.`,
    );
    const count = await super.remove(contact);
    await this.cacheManager.remove(`${id}`);
    this.logger.debug(
      `The number of contacts in the DB after contact name: ${contact.firstName} ${contact.lastName} deleted is: ${count}`,
    );
    return contact;
  }

  async updateWithCache(id: number, updateContactDto: UpdateContactDto) {
    this.logger.debug(`trying to update contact in DB. Contact id: ${id}`);
    await this.findOneOrThrow(id);
    const contact = await super.save(updateContactDto);
    await this.cacheManager.update(`${id}`, contact);
    this.logger.debug(
      `contact updated in the DB. fullName: ${contact.firstName} ${contact.lastName}`,
    );
    return updateContactDto;
  }
}
