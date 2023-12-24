import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { BooksService } from './books.service'
import { INestApplication } from '@nestjs/common'
import { BooksController } from './books.controller'

describe('Books', () => {
  let app: INestApplication
  const booksService = {
    findAll: () => ['test'],
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [BooksController],
      providers: [BooksService],
    })
      .overrideProvider(BooksService)
      .useValue(booksService)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('/GET books', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect(booksService.findAll())
  })

  afterAll(async () => {
    await app.close()
  })
})
