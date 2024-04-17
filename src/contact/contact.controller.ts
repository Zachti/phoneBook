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
import { SortByTypeValidator } from '../commons/validators/sortBy.validator';
import { ListDto } from '../commons/dto/list.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  async findAll(@Body(new SortByTypeValidator()) listDto: ListDto) {
    return await this.contactService.findAll(listDto);
  }

  @Get('size')
  async count() {
    const count = await this.contactService.count();
    return { count };
  }

  @Get('search')
  async search(@Body() searchContactDto: SearchContactDto) {
    const contacts = await this.contactService.search(searchContactDto);
    return { contacts, count: contacts.length };
  }

  @Patch('update')
  update(@Query('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete('delete')
  remove(@Query('id') id: string) {
    return this.contactService.remove(+id);
  }

  @Get(':id')
  findOne(@Query('id') id: string) {
    return this.contactService.findOneOrFail(+id);
  }

  @Get('favorites')
  async findAllFavorites() {
    const favorites = await this.contactService.findMarkedContacts(true);
    return { favorites, count: favorites.length };
  }

  @Get('block')
  async findAllBlockedContacts() {
    const blocked = await this.contactService.findMarkedContacts(false);
    return { blocked, count: blocked.length };
  }
}
