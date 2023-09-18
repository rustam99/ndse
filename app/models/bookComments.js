import mongoose, { Schema, model } from 'mongoose';

const bookCommentsSchema = new Schema({
    user: [
        { type: mongoose.Types.ObjectId, ref: 'User' },
    ],
    book: [
        { type: mongoose.Types.ObjectId, ref: 'Book' },
    ],
    comment: {
      type: String,
    },
    date: {
        type: Date, default: Date.now,
    },
    __v: {
        type: Number,
        select: false,
    },
});

export const bookCommentsModel = model('BookComments', bookCommentsSchema);
