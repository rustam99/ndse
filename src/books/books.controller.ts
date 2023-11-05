import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { ICreateBookDTO, IEditBookDTO } from './types';
import { NotFoundException } from '../utils/Exceptions/NotFoundException';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAll() {
    return this.booksService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    const book = this.booksService.getById(id);

    if (!book) throw new NotFoundException();

    return book;
  }

  @Post()
  create(@Body() createBookDto: ICreateBookDTO) {
    return this.booksService.create(createBookDto);
  }

  @Put(':id')
  edit(@Param('id') id: string, @Body() editBookDto: IEditBookDTO) {
    const book = this.booksService.edit(id, editBookDto);

    if (!book) throw new NotFoundException();

    return book;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const book = this.booksService.remove(id);

    if (!book) throw new NotFoundException();

    return book;
  }
}
