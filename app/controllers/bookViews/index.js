import { bookModel } from '../../models/book.js';
import mongoose from 'mongoose';

const index = async (request, response) => {
    let books = [];

    try {
        books = await bookModel.find().exec();
    } catch (e) {
        console.log(e);
    }

    response.render('../views/index.ejs', {
        title: 'Библиотека',
        books: books,
    });
}

const view = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        response.redirect('/404');
    }

    try {
        const book = await bookModel.findById(id).exec();

        if (!book) return response.redirect('/404');

        response.render('../views/view.ejs', {
            title: book.title,
            book: book,
        });
    } catch (e) {
        console.log(e);
        response.redirect('/404');
    }
}

const create = (request, response) => {
    response.render('../views/create.ejs', {
        title: 'Добавить',
        book: {},
    });
}

const update = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return response.redirect('/404');

    try {
        const book = await bookModel.findById(id);

        if (!id) return response.redirect('/404');

        response.render('../views/update.ejs', {
            title: 'Редактировать',
            book: book,
        });
    } catch (e) {
        console.log(e);
        response.redirect('/404');
    }
}

export { index, view, create, update }
