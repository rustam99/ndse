import { bookModel } from '../models/book'
import mongoose from 'mongoose'
import { injectable } from 'inversify'
import { Book, IBook, ICreateBookDTO } from '../types/Book'

export const BookRepositoryID = Symbol.for('BookRepository')

@injectable()
export class BookRepository implements Book {
  async getAll() {
    return bookModel.find().exec()
  }

  async getOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null

    return bookModel.findById(id).exec()
  }

  async create(book: ICreateBookDTO) {
    return bookModel.create(book)
  }

  async edit(id: string, data: Partial<Omit<IBook, 'id'>>) {
    const book = await bookModel.findById(id).exec()

    if (!book) return null

    for (const key in data) {
      if (key in book) {
        // @ts-ignore
        book[key] = data[key]
      }
    }

    return book.save()
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null

    return bookModel.findByIdAndDelete(id).exec()
  }
}