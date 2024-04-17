import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchContactDto } from './dto/search-contact.dto';
import { DatabaseTypes, SortByTypes } from './enums/enums';
import { DatabaseTypesValidationPipe } from './validators/databaseType.validator';
import { SortByTypeValidator } from './validators/sortBy.validator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  findAll(
    @Query('persistenceMethod', new DatabaseTypesValidationPipe())
    database: DatabaseTypes,
    @Query('sortBy', new SortByTypeValidator()) sortBy: SortByTypes,
  ) {
    return this.contactService.findAll(database, sortBy);
  }

  @Get('size')
  async count(
    @Query('persistenceMethod', new DatabaseTypesValidationPipe())
    database: DatabaseTypes,
  ) {
    const count = await this.contactService.count(database);
    return { count };
  }

  @Get('search')
  search(
    @Body() searchContactDto: SearchContactDto,
    @Query('persistenceMethod', new DatabaseTypesValidationPipe())
    database: DatabaseTypes,
  ) {
    return this.contactService.search(searchContactDto, database);
  }

  @Patch('update')
  update(@Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(updateContactDto);
  }

  @Delete('delete')
  remove(@Body() searchContactDto: SearchContactDto) {
    return this.contactService.remove(searchContactDto);
  }
}
