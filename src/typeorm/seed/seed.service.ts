import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { contacts } from './mockContacts';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Contact } from '../../contact/entities/contact.entity';

@Injectable()
export class SeedService implements OnModuleDestroy, OnModuleInit {
  constructor(
    private readonly logger: LoggerService,
    @InjectDataSource('mysql') private readonly ds: DataSource,
  ) {}
  async onModuleInit() {
    await this.createTable();
    await this.seedContacts();
  }

  private async seedContacts() {
    this.logger.debug('Seeding contacts...');
    const queryRunner = this.ds.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const contactRepository = queryRunner.manager.getRepository(Contact);
    const contactEntities = contacts.map((contactData) =>
      contactRepository.create(contactData),
    );

    try {
      await this.ds.manager.save(contactEntities);
      await queryRunner.commitTransaction();
      this.logger.debug('Contacts seeded!');
    } catch (e) {
      this.logger.error('Error seeding contacts: ', e.message);
      this.logger.debug('Rolling back transaction...');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async createTable() {
    //await this.ds.query(`DROP TABLE contacts`);
    this.logger.debug('Creating table...');
    await this.ds.query(`CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) DEFAULT '',
    phoneNumber VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    email VARCHAR(255),
    notes TEXT,
    isFavorite BOOLEAN DEFAULT false,
    isBlocked BOOLEAN DEFAULT false,
    imageUrl VARCHAR(255)
    )`);
    this.logger.debug(`Table created.`);
  }

  public async onModuleDestroy() {
    await this.ds.dropDatabase();
  }
}
