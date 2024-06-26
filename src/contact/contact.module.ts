import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { CacheCoreModule } from '../cache/cache.module';
import { ContactRepository } from './contact.repository';
import { ValidatePhoneNumberConstraint } from './validators/phoneNumber.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Contact], 'mysql'), CacheCoreModule],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository, ValidatePhoneNumberConstraint],
})
export class ContactModule {}
