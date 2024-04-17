import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacts } from './entities/contact.entity';
import { CacheCoreModule } from '../cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contacts], 'mysql'), CacheCoreModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
