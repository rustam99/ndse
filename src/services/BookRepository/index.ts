import { v4 as uuid } from 'uuid';
import { IBook} from '../../types/Book'

abstract class AbstractBookRepository {
  abstract createBook(book: IBook): IBook
  abstract getBook(id: string): IBook | undefined
  abstract getBooks(): IBook[]
  abstract updateBook(id: string, book: Partial<Omit<IBook, 'id'>>): IBook
  abstract deleteBook(id: string): boolean | undefined
}

export class BookRepository extends AbstractBookRepository {
  books: IBook[] = []

  createBook(book: Omit<IBook, 'id'>): IBook {
    const createdBook = {...book, id: uuid() }

    this.books.push(createdBook)

    return createdBook
  }

  getBooks(): IBook[] {
    return this.books
  }

  getBook(id: string): IBook {
    return this.books.find((book) => book.id === id);
  }

  updateBook(id: string, updateFields: Partial<Omit<IBook, 'id'>>): IBook | undefined {
    const bookIndex = this.books.findIndex((item) => item.id === id)

    if (bookIndex < 0) return undefined

    this.books[bookIndex] = {...this.books[bookIndex], ...updateFields}

    return this.books[bookIndex]
  }

  deleteBook(id: string): boolean | undefined {
    const bookIndex = this.books.findIndex((item) => item.id === id)

    if (bookIndex < 0) return undefined

    this.books.splice(bookIndex, 1)

    return true
  }
}