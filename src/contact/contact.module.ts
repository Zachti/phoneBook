import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacts } from './entities/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contacts], 'mongodb'),
    TypeOrmModule.forFeature([Contacts], 'mysql'),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
