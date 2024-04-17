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
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchContactDto } from './dto/search-contact.dto';
import { SortByTypes } from './enums/enums';
import { SortByTypeValidator } from './validators/sortBy.validator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  findAll(@Query('sortBy', new SortByTypeValidator()) sortBy: SortByTypes) {
    return this.contactService.findAll(sortBy);
  }

  @Get('size')
  async count() {
    const count = await this.contactService.count();
    return { count };
  }

  @Get('search')
  search(@Body() searchContactDto: SearchContactDto) {
    return this.contactService.search(searchContactDto);
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
  findOne(@Param('id') id: string) {
    return this.contactService.findOneOrFail(+id);
  }
}
