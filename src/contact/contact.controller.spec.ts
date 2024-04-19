import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { CreateContactDto, SearchContactDto } from './dto';
import { ListDto } from '../commons/dto/list.dto';
import { listResponse, paginationResponse } from './interfaces';
import { ContactRepository } from './contact.repository';
import { LoggerService } from '../logger/logger.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SortKeys, SortType } from '../commons/enums/enums';
import { Contact } from './entities/contact.entity';

describe('ContactController', () => {
  let controller: ContactController;
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        ContactService,
        ContactRepository,
        {
          provide: LoggerService,
          useFactory: () => {
            return {
              log(...args: any[]) {
                console.log(args);
              },
              debug(...args: any[]) {
                console.log(args);
              },
              info(...args: any[]) {
                console.log(args);
              },
              error(...args: any[]) {
                console.log(args);
              },
            };
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: getRepositoryToken(ContactRepository),
          useValue: 'mysql',
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new contact', async () => {
    const createContactDto: CreateContactDto = {
      firstName: 'zach',
      phoneNumber: '0535240646',
    };

    const mockContact = {
      firstName: 'zach',
      phoneNumber: '0535240646',
      address: null,
      imageUrl: null,
      email: null,
      notes: null,
      id: 23,
      lastName: '',
      isFavorite: false,
      isBlocked: false,
    };
    jest.spyOn(service, 'create').mockResolvedValue(mockContact);

    const result = await controller.create(createContactDto);

    expect(result).toBe(mockContact);
  });

  it('should throw an error if phoneNumber is missing', async () => {
    const createContactDto: CreateContactDto = {
      firstName: 'zach',
      phoneNumber: null,
    };

    await expect(controller.create(createContactDto)).rejects.toThrow();
  });

  it('should throw an error if email is invalid', async () => {
    const createContactDto: CreateContactDto = {
      firstName: 'zach',
      phoneNumber: '0535240646',
      email: 'invalid-email',
    };

    await expect(controller.create(createContactDto)).rejects.toThrow();
  });

  it('should throw an error if imageUrl is not url', async () => {
    const createContactDto: CreateContactDto = {
      firstName: 'zach',
      phoneNumber: '0535240646',
      imageUrl: 'invalid-url',
    };

    await expect(controller.create(createContactDto)).rejects.toThrow();
  });

  it('should create a new contact will full details', async () => {
    const createContactDto: CreateContactDto = {
      firstName: 'Zach',
      lastName: 'Tirosh',
      phoneNumber: '0535240646',
      address: 'dochifat 5, savyon',
      imageUrl: 'https://www.google.com',
      email: 'zachti@mta.ac.il',
      notes: 'Hello zak!',
    };

    const mockContact = {
      firstName: 'Zach',
      phoneNumber: '0535240646',
      address: 'dochifat 5, savyon',
      imageUrl: 'https://www.google.com',
      email: 'zachti@mta.ac.il',
      notes: 'Hello zak!',
      id: 23,
      lastName: 'Tirosh',
      isFavorite: false,
      isBlocked: false,
    };
    jest.spyOn(service, 'create').mockResolvedValue(mockContact);

    const result = await controller.create(createContactDto);

    expect(result).toBe(mockContact);
  });

  it('should return a list of contacts paginated with 1 contact per page', async () => {
    const listDto: ListDto = {
      skip: 0,
      take: 1,
      order: {
        key: SortKeys.FirstName,
        type: SortType.asc,
      },
    };

    const pagination = true;

    const mockResponse: paginationResponse = {
      paginatedContacts: [],
      totalPages: 2,
      totalContacts: 2,
    };

    jest.spyOn(service, 'findAll').mockResolvedValue(mockResponse);

    const result = await controller.findAll(listDto, pagination);

    expect(result).toEqual(mockResponse);
  });

  it('should return a list of contacts without pagination', async () => {
    const listDto: ListDto = {
      skip: 0,
      take: 1,
      order: {
        key: SortKeys.FirstName,
        type: SortType.asc,
      },
    };

    const pagination = null;

    const mockResponse: listResponse = {
      contacts: [],
      count: 2,
    };

    jest.spyOn(service, 'findAll').mockResolvedValue(mockResponse);

    const result = await controller.findAll(listDto, pagination);

    expect(result).toEqual(mockResponse);
  });

  it('should return the count of contacts', async () => {
    const mockCount = 10;

    jest.spyOn(service, 'count').mockResolvedValue(mockCount);

    const result = await controller.count();

    expect(result).toEqual({ count: mockCount });
  });

  it('should return search results paginated', async () => {
    const mockSearchContactDto: SearchContactDto = {
      firstName: 'z',
    };

    const mockPagination = true; // Mock pagination value here

    const mockResponse: paginationResponse = {
      paginatedContacts: [
        [
          {
            id: 23,
            firstName: 'zach',
            phoneNumber: '0535240646',
            address: null,
            imageUrl: null,
            email: null,
            notes: null,
            lastName: '',
            isFavorite: false,
            isBlocked: false,
          },
        ],
      ],
      totalPages: 1,
      totalContacts: 1,
    };

    jest.spyOn(service, 'search').mockResolvedValue(mockResponse);

    const result = await controller.search(
      mockSearchContactDto,
      mockPagination,
    );

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error for invalid firstName', async () => {
    const mockSearchContactDto: SearchContactDto = {
      firstName: '$',
    };
    await expect(
      controller.search(mockSearchContactDto, null),
    ).rejects.toThrow();
  });

  it('should throw an error for invalid lastName', async () => {
    const mockSearchContactDto: SearchContactDto = {
      lastName: '+',
    };
    await expect(
      controller.search(mockSearchContactDto, null),
    ).rejects.toThrow();
  });

  it('should remove a contact by ID', async () => {
    const mockContactId = '1';

    const mockDeletedContact = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      address: '123 Main St',
      isFavorite: true,
      isBlocked: false,
      imageUrl: 'https://example.com/image1.jpg',
      email: null,
      notes: null,
    };

    jest
      .spyOn(service, 'remove')
      .mockResolvedValue(mockDeletedContact as Contact);

    const result = await controller.remove(mockContactId);

    expect(service.remove).toHaveBeenCalledWith(+mockContactId);
    expect(result).toEqual(mockDeletedContact);
  });

  it('should update a contact by ID', async () => {
    const mockContactId = '1';

    const mockUpdatedContact = {
      address: '123 Main St',
      isFavorite: true,
      imageUrl: 'https://example.com/image1.jpg',
    };

    jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedContact);

    const result = await controller.update(mockContactId, mockUpdatedContact);

    expect(service.update).toHaveBeenCalledWith(
      +mockContactId,
      mockUpdatedContact,
    );
    expect(result).toEqual(mockUpdatedContact);
  });

  it('should find all favorite contacts', async () => {
    const mockListDto: ListDto = {
      skip: 0,
      take: 10,
      order: {
        key: SortKeys.Id,
        type: SortType.desc,
      },
    };
    const mockPagination = true;

    const mockResponse: paginationResponse = {
      paginatedContacts: [
        [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '1234567890',
            address: '123 Main St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image1.jpg',
            email: null,
            notes: null,
          },
          {
            id: 3,
            firstName: 'Alice',
            lastName: 'Smith',
            phoneNumber: '9876543210',
            address: '789 Oak St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image3.jpg',
            email: null,
            notes: null,
          },
          {
            id: 5,
            firstName: 'Michael',
            lastName: 'Brown',
            phoneNumber: '1112223333',
            address: '456 Maple St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image5.jpg',
            email: null,
            notes: null,
          },
          {
            id: 7,
            firstName: 'William',
            lastName: 'Miller',
            phoneNumber: '4445556666',
            address: '123 Oak St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image7.jpg',
            email: null,
            notes: null,
          },
          {
            id: 9,
            firstName: 'James',
            lastName: 'Wilson',
            phoneNumber: '3334445555',
            address: '456 Birch St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image9.jpg',
            email: null,
            notes: null,
          },
          {
            id: 11,
            firstName: 'David',
            lastName: 'Jones',
            phoneNumber: '1231231234',
            address: '789 Cedar St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image11.jpg',
            email: null,
            notes: null,
          },
          {
            id: 13,
            firstName: 'Daniel',
            lastName: 'Martinez',
            phoneNumber: '7897897890',
            address: '123 Elm St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image13.jpg',
            email: null,
            notes: null,
          },
          {
            id: 15,
            firstName: 'Ethan',
            lastName: 'Lopez',
            phoneNumber: '6546546543',
            address: '789 Cedar St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image15.jpg',
            email: null,
            notes: null,
          },
          {
            id: 17,
            firstName: 'Ava',
            lastName: 'Hernandez',
            phoneNumber: '1112223333',
            address: '123 Pine St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image17.jpg',
            email: null,
            notes: null,
          },
          {
            id: 19,
            firstName: 'Mia',
            lastName: 'Wright',
            phoneNumber: '7778889999',
            address: '789 Cedar St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image19.jpg',
            email: null,
            notes: null,
          },
        ],
        [
          {
            id: 21,
            firstName: 'Isabella',
            lastName: 'Perez',
            phoneNumber: '6667778888',
            address: '456 Oak St',
            isFavorite: true,
            isBlocked: false,
            imageUrl: 'https://example.com/image21.jpg',
            email: null,
            notes: null,
          },
        ],
      ],
      totalPages: 2,
      totalContacts: 11,
    };

    jest.spyOn(service, 'findMarkedContacts').mockResolvedValue(mockResponse);

    const result = await controller.findAllFavorites(
      mockListDto,
      mockPagination,
    );

    expect(service.findMarkedContacts).toHaveBeenCalledWith(
      true,
      mockListDto,
      mockPagination,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should find all blocked contacts', async () => {
    const mockListDto: ListDto = {
      skip: 0,
      take: 10,
      order: {
        key: SortKeys.Id,
        type: SortType.desc,
      },
    };
    const mockPagination = false;

    const mockResponse: listResponse = {
      contacts: [],
      count: 0,
    };

    jest.spyOn(service, 'findMarkedContacts').mockResolvedValue(mockResponse);

    const result = await controller.findAllBlockedContacts(
      mockListDto,
      mockPagination,
    );

    expect(service.findMarkedContacts).toHaveBeenCalledWith(
      false,
      mockListDto,
      mockPagination,
    );
    expect(result).toEqual(mockResponse);
  });
});
