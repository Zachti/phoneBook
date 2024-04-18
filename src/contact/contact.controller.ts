import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Param,
  DefaultValuePipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, SearchContactDto } from './dto';
import { ListDto } from '../commons/dto/list.dto';
import { paginationResponse } from './interfaces';
import { Contact } from './entities/contact.entity';
import { SortByTransform } from '../commons/pipes/sortBy.transform';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactService.create(createContactDto);
  }

  @Get()
  async findAll(
    @Body(
      new DefaultValuePipe({ skip: 0, take: 10, order: {} }),
      new SortByTransform(),
    )
    listDto: ListDto,
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
    @Body(
      new DefaultValuePipe({ skip: 0, take: 10, order: {} }),
      new SortByTransform(),
    )
    listDto: ListDto,
  ): Promise<paginationResponse> {
    return await this.contactService.search(searchContactDto, listDto);
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
  findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactService.findOneOrFail(+id);
  }

  @Get('favorites')
  async findAllFavorites(
    @Body(
      new DefaultValuePipe({ skip: 0, take: 10, order: {} }),
      new SortByTransform(),
    )
    listDto: ListDto,
  ): Promise<paginationResponse> {
    return await this.contactService.findMarkedContacts(true, listDto);
  }

  @Get('block')
  async findAllBlockedContacts(
    @Body(
      new DefaultValuePipe({ skip: 0, take: 10, order: {} }),
      new SortByTransform(),
    )
    listDto: ListDto,
  ): Promise<paginationResponse> {
    return await this.contactService.findMarkedContacts(false, listDto);
  }
}
