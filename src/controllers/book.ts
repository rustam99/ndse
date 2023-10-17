import { Response, Request } from 'express'
import { BookRepository } from '../services/BookRepository'

const bookRepository = new BookRepository()

const returnNotFound = (response: Response) => {
    response.status(404);
    response.json('Not found');
}

const getAll = (request: Request, response: Response) => {
    response.status(200);
    response.json(bookRepository.getBooks());
}

const getById = (request: Request, response: Response) => {
    const { id } = request.params;

    const book = bookRepository.getBook(id)

    if (!book) return returnNotFound(response);

    response.status(200);
    response.json(book);
}

const create = (request: Request, response: Response) => {
    const createdBook = bookRepository.createBook(request.body)

    response.status(201);
    response.json(createdBook);
}

const edit = (request: Request, response: Response) => {
    const { id } = request.params;

    const updatedBook = bookRepository.updateBook(id, request.body)

    if (!updatedBook) return returnNotFound(response);

    response.status(200);
    response.json(updatedBook);
}

const remove = (request: Request, response: Response) => {
    const { id } = request.params;

    const isDeleted = bookRepository.deleteBook(id)

    if (!isDeleted) return returnNotFound(response);

    response.status(200);
    response.json('ok');
}

export { getAll, getById, create, edit, remove }
