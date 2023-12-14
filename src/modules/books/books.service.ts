import { Model, isValidObjectId } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Book } from './schemas/books.schema'
import { ICreateBookDTO, IUpdateBookDTO } from './interfaces/dto'

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.bookModel.find().exec()
  }
  findById(id: string): Promise<Book | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null)

    return this.bookModel.findById(id).exec()
  }

  create(createBookDTO: ICreateBookDTO): Promise<Book> {
    return this.bookModel.create(createBookDTO)
  }
  update(id: string, updateBookDTO: IUpdateBookDTO): Promise<Book | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null)

    return this.bookModel
      .findByIdAndUpdate(id, updateBookDTO, { returnDocument: 'after' })
      .exec()
  }
  remove(id: string): Promise<Book | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null)

    return this.bookModel.findByIdAndDelete(id).exec()
  }
}
