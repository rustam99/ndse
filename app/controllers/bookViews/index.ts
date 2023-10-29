import { container } from '../../container'
import { BookRepositoryID } from '../../serveices/BooksRepository'
import { Book, IBook } from '../../types/Book'
import { Request, Response } from 'express'

const service = container.get<Book>(BookRepositoryID)

const index = async (request: Request, response: Response) => {
    let books: IBook[] | never[] = [];

    try {
        books = await service.getAll();
    } catch (e) {
        console.log(e);
    }

    response.render('../views/index.ejs', {
        title: 'Библиотека',
        books: books,
    });
}

const view = async (request: Request, response: Response) => {
    const { id } = request.params;

    try {
        const book = await service.getOne(id)

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

const create = (request: Request, response: Response) => {
    response.render('../views/create.ejs', {
        title: 'Добавить',
        book: {},
    });
}

const update = async (request: Request, response: Response) => {
    const { id } = request.params;

    try {
        const book = await service.getOne(id)

        if (!book) return response.redirect('/404');

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
