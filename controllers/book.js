import { v4 as uuid } from 'uuid';

const books = [];

const getProtectedBook = (body) => {
    const { title, description, authors, favorite, fileCover, fileName } = body;
    const book = {};

    if (title) book.title = title;
    if (description) book.description = description;
    if (authors) book.authors = authors;
    if (favorite) book.favorite = favorite;
    if (fileCover) book.fileCover = fileCover;
    if (fileName) book.fileName = fileName;

    return book;
}

const createBook = (body) => {
    const book = getProtectedBook(body);

    return {
        id: uuid(),
        title: book.title ?? '',
        description: book.description ?? '',
        authors: book.authors ?? '',
        favorite: book.favorite ?? '',
        fileCover: book.fileCover ?? '',
        fileName: book.fileName ?? '',
    }
}

const returnNotFound = (response) => {
    response.status(404);
    response.json('Not found');
}

const getAll = (request, response) => {
    response.status(200);
    response.json(books);
}

const getById = (request, response) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index < 0) return returnNotFound(response);

    response.status(200);
    response.json(books[index]);
}

const create = (request, response) => {
    const book = createBook(request.body);

    books.push(book);

    response.status(201);
    response.json(book);
}

const edit = (request, response) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index < 0) return returnNotFound(response);
    const protectedBook = getProtectedBook(request.body);

    books[index] = { ...books[index], ...protectedBook };

    response.status(200);
    response.json(books[index]);
}

const remove = (request, response) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index < 0) return returnNotFound(response);

    books.splice(index, 1);

    response.status(200);
    response.json('ok');
}

export { getAll, getById, create, edit, remove }
