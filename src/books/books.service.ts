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

  findAll() {
    return this.bookModel.find().exec()
  }
  async findById(id: string) {
    if (!isValidObjectId(id)) return null

    return this.bookModel.findById(id).exec()
  }

  create(createBookDTO: ICreateBookDTO) {
    return this.bookModel.create(createBookDTO)
  }
  update(id: string, updateBookDTO: IUpdateBookDTO) {
    if (!isValidObjectId(id)) return Promise.resolve(null)

    return this.bookModel
      .findByIdAndUpdate(id, updateBookDTO, { returnDocument: 'after' })
      .exec()
  }
  remove(id: string) {
    if (!isValidObjectId(id)) return Promise.resolve(null)

    return this.bookModel.findByIdAndDelete(id).exec()
  }
}
