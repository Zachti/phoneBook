import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacts } from './entities/contact.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contacts], 'mysql'),
    CacheModule.register({
      host: 'redis',
      port: 6379,
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
