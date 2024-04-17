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
import { listResponse } from './interfaces/listResponse.interface';
import { Contact } from './entities/contact.entity';
import { paginationResponse } from './interfaces/pagination.response';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactService.create(createContactDto);
  }

  @Get()
  async findAll(
    @Body(new SortByTypeValidator()) listDto: ListDto,
  ): Promise<paginationResponse> {
    return await this.contactService.findAll(listDto);
  }

  @Get('size')
  async count() {
    const count = await this.contactService.count();
    return { count };
  }

  @Get('search')
  async search(
    @Body() searchContactDto: SearchContactDto,
  ): Promise<listResponse> {
    return await this.contactService.search(searchContactDto);
  }

  @Patch('update')
  update(
    @Query('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<UpdateContactDto> {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete('delete')
  remove(@Query('id') id: string): Promise<Contact> {
    return this.contactService.remove(+id);
  }

  @Get(':id')
  findOne(@Query('id') id: string): Promise<Contact> {
    return this.contactService.findOneOrFail(+id);
  }

  @Get('favorites')
  async findAllFavorites(): Promise<listResponse> {
    return await this.contactService.findMarkedContacts(true);
  }

  @Get('block')
  async findAllBlockedContacts(): Promise<listResponse> {
    return await this.contactService.findMarkedContacts(false);
  }
}
