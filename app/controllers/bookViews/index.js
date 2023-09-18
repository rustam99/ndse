import { bookModel } from '../../models/book.js';
import { bookCommentsModel } from '../../models/bookComments.js';
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
        isAuth: request.isAuthenticated(),
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

        const comments = await bookCommentsModel.find({ book: book.id, }).populate({
            path: 'user',
            select: '-password -salt',
        }).exec();

        response.render('../views/books/view.ejs', {
            title: book.title,
            book: book,
            isAuth: request.isAuthenticated(),
            comments: comments,
        });
    } catch (e) {
        console.log(e);
        response.redirect('/404');
    }
}

const create = (request, response) => {
    response.render('../views/books/create.ejs', {
        title: 'Добавить',
        book: {},
        isAuth: request.isAuthenticated(),
    });
}

const update = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return response.redirect('/404');

    try {
        const book = await bookModel.findById(id).exec();

        if (!id) return response.redirect('/404');

        response.render('../views/books/update.ejs', {
            title: 'Редактировать',
            book: book,
            isAuth: request.isAuthenticated(),
        });
    } catch (e) {
        console.log(e);
        response.redirect('/404');
    }
}

export { index, view, create, update }
