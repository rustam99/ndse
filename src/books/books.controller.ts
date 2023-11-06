import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { BooksService } from './books.service'
import { NotFoundException } from '../utils/Exceptions/NotFoundException'
import { ICreateBookDTO, IUpdateBookDTO } from './interfaces/dto'

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAll() {
    return this.booksService.findAll()
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const book = await this.booksService.findById(id)

    if (!book) throw new NotFoundException()

    return book
  }

  @Post()
  create(@Body() createBookDto: ICreateBookDTO) {
    return this.booksService.create(createBookDto)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: IUpdateBookDTO) {
    const book = await this.booksService.update(id, updateBookDto)

    if (!book) throw new NotFoundException()

    return book
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const book = await this.booksService.remove(id)

    if (!book) throw new NotFoundException()

    return book
  }
}
