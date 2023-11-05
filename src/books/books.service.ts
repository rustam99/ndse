import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IBook, ICreateBookDTO, IEditBookDTO, IBooksService } from './types';

@Injectable()
export class BooksService implements IBooksService {
  private readonly books: IBook[];

  constructor() {
    this.books = [];
  }

  getAll(): IBook[] {
    return this.books;
  }
  getById(id: string): IBook | null {
    const book = this.books.find((book) => book.id === id);

    return book ?? null;
  }

  create(book: ICreateBookDTO): IBook {
    const createdBook = { ...book, id: uuid() };

    this.books.push(createdBook);

    return createdBook;
  }
  edit(id: string, book: IEditBookDTO): IBook | null {
    const index = this.books.findIndex((book) => book.id === id);

    if (index < 0) return null;

    this.books[index] = { ...this.books[index], ...book };

    return this.books[index];
  }
  remove(id: string): IBook | null {
    const index = this.books.findIndex((book) => book.id === id);

    if (index < 0) return null;

    return this.books.splice(index, 1)[0];
  }
}
