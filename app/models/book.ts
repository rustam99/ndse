import { Schema, model, Document } from 'mongoose';
import { IBook } from '../types/Book'

const bookSchema = new Schema({
    title: String,
    description: String,
    authors: String,
    favorite: String,
    fileCover: String,
    fileName: String,
    fileBook: String,
    __v: {
      type: Number,
      select: false,
    },
});

export const bookModel = model<IBook & Document>('Book', bookSchema);
