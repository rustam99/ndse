import { bookModel } from '../models/book.js'
import mongoose from 'mongoose'

export class BookRepository {
  async getAll() {
    return bookModel.find().exec();
  }

  async getOne(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return bookModel.findById(id).exec();
  }

  async create(book) {
    return bookModel.create(book);
  }

  async edit(id, data) {
    const book = await bookModel.findById(id).exec();

    for (const key in data) {
      if (key in book) book[key] = data[key];
    }

    return book.save();
  }

  async remove(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return bookModel.findByIdAndDelete(id).exec();
  }
}