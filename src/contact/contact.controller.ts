import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, SearchContactDto } from './dto';
import { ListDto } from '../commons/dto/list.dto';
import { listResponse, paginationResponse } from './interfaces';
import { Contact } from './entities/contact.entity';
import { SortByTransform } from '../commons/pipes/sortBy.transform';
import { ListDtoPipe } from '../commons/pipes/listDto.transform';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactService.create(createContactDto);
  }

  @Get('all')
  async findAll(
    @Body(new ListDtoPipe(), new SortByTransform())
    listDto: ListDto,
    @Query('pagination') pagination: boolean,
  ): Promise<paginationResponse | listResponse> {
    return await this.contactService.findAll(listDto, pagination);
  }

  @Get('size')
  async count() {
    const count = await this.contactService.count();
    return { count };
  }

  @Get('search')
  async search(
    @Body() searchContactDto: SearchContactDto,
    @Body(new ListDtoPipe(), new SortByTransform())
    listDto: ListDto,
    @Query('pagination') pagination: boolean,
  ): Promise<paginationResponse | listResponse> {
    return await this.contactService.search(
      searchContactDto,
      listDto,
      pagination,
    );
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

  @Get('favorites')
  async findAllFavorites(
    @Body(new ListDtoPipe(), new SortByTransform())
    listDto: ListDto,
    @Query('pagination') pagination: boolean,
  ): Promise<paginationResponse | listResponse> {
    return await this.contactService.findMarkedContacts(
      true,
      listDto,
      pagination,
    );
  }

  @Get('block')
  async findAllBlockedContacts(
    @Body(new ListDtoPipe(), new SortByTransform())
    listDto: ListDto,
    @Query('pagination') pagination: boolean,
  ): Promise<paginationResponse | listResponse> {
    return await this.contactService.findMarkedContacts(
      false,
      listDto,
      pagination,
    );
  }

  @Get()
  findOne(@Query('id') id: string): Promise<Contact> {
    return this.contactService.findOneOrFail(+id);
  }
}
