import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    authors: {
        type: String,
    },
    favorite: {
        type: String,
    },
    fileCover: {
        type: String,
    },
    fileName: {
        type: String,
    },
    fileBook: {
        type: String,
    },
    __v: {
      type: Number,
      select: false,
    },
});

export const bookModel = model('Book', bookSchema);
