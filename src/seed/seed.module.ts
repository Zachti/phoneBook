import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../contact/entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact], 'mysql')],
  providers: [SeedService],
})
export class SeedModule {}
