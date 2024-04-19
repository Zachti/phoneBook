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
    if (value) {
      this.logger.debug(`Contact with id [${id}] found in cache.`);
      return value;
    }
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
    await super.remove(contact);
    await this.cacheManager.remove(`${id}`);
    this.logger.debug(
      `contact: ${contact.firstName} ${contact.lastName} deleted from DB.`,
    );
    return contact;
  }

  async updateWithCache(id: number, updateContactDto: UpdateContactDto) {
    this.logger.debug(`trying to update contact in DB. Contact id: [${id}]`);
    await this.findOneOrThrow(id);
    await super.update(id, updateContactDto);
    await this.cacheManager.remove(`${id}`);
    this.logger.debug(`contact updated in the DB. contact id: [${id}]`);
    return updateContactDto;
  }
}
