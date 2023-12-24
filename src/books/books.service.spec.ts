import { Test, TestingModule } from '@nestjs/testing'
import { BooksService } from './books.service'
import { BooksController } from './books.controller'
import { getModelToken } from '@nestjs/mongoose'
import { Book } from './schemas/books.schema'
import mongoose from 'mongoose'

describe('BooksService', () => {
  let bookService: BooksService

  const mockBooks = [
    {
      _id: '551137c2f9e1fac808a5f572',
      name: 'asd',
      authors: ['asd', 'qwe'],
    },
    {
      _id: '651137c2f9e1fac808a5f572',
      name: 'qwe',
      authors: ['qwe', 'asd'],
    },
  ]

  const mockBoosService = {
    findById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBoosService,
        },
      ],
    }).compile()

    bookService = module.get<BooksService>(BooksService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('find all', () => {
    it('should find and return all books', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      jest.spyOn(bookService, 'findAll').mockImplementation(() => mockBooks)

      const result = await bookService.findAll()

      expect(result).toEqual(mockBooks)
    })
  })

  describe('find by id', () => {
    it('should find and return book by Id', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      jest.spyOn(bookService, 'findById').mockResolvedValue(mockBooks[0])

      const result = await bookService.findById(mockBooks[0]._id)

      expect(result).toEqual(mockBooks[0])
    })

    it('should return null', async () => {
      const id = 'invalid-id'

      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false)

      const result = await bookService.findById(id)

      expect(result).toBeNull()
    })
  })
})
