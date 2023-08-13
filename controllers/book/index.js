import { v4 as uuid } from 'uuid';
import { access, constants, mkdir, rm } from 'fs'
import { join } from "path";
import { rootPath } from '../../utils/root.js';
import { returnNotFound } from '../../utils/returnNotFound.js';
import { config } from '../../config.js';
import { books, editBook, addBook, removeBook } from '../../store/index.js';

const checkAndCreateUploadDir = () => {
    access(join(rootPath, config.UPLOAD), constants.R_OK, (error) => {
        if (error) {
            mkdir(join(rootPath, config.UPLOAD), (err) => {
                if (err) console.log(`Не удалось создать паку ${config.UPLOAD}`);
            });
        }
    });
}

checkAndCreateUploadDir();

const getProtectedBook = (body) => {
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = body;
    const book = {};

    if (title) book.title = title;
    if (description) book.description = description;
    if (authors) book.authors = authors;
    if (favorite) book.favorite = favorite;
    if (fileCover) book.fileCover = fileCover;
    if (fileName) book.fileName = fileName;
    if (fileBook) book.fileBook = fileBook;

    return book;
}

const createBook = (body) => {
    const book = getProtectedBook(body);

    return {
        id: uuid(),
        title: book.title ?? '',
        description: book.description ?? '',
        authors: book.authors ?? '',
        favorite: !!book.favorite,
        fileCover: book.fileCover ?? '',
        fileName: book.fileName ?? '',
        fileBook: book.fileName ?? '',
    }
}

const findBookIndex = (request) => {
    const { id } = request.params;

    return books.findIndex((book) => book.id === id);
}

const saveFileToBook = (request, book) => {
    if (request.file) {
        const { path, filename } = request.file;

        if (book.fileBook) {
            rm(book.fileBook, (err) => {
                if (err) console.log('Не удалось удалить предыдущий файл, возможно был уже удален');
            });
        }

        book.fileName = filename;
        book.fileBook = path;
    }

    return book;
}

const getAll = (request, response) => {
    response.status(200);
    response.json(books);
}

const getById = (request, response) => {
    const index = findBookIndex(request);

    if (index < 0) return returnNotFound(response);

    response.status(200);
    response.json(books[index]);
}

const create = (request, response) => {
    const book = createBook(request.body);

    saveFileToBook(request, book);

    addBook(book)

    response.status(201);
    response.json(book);
}

const edit = (request, response) => {
    const index = findBookIndex(request);

    if (index < 0) return returnNotFound(response);
    const protectedBook = getProtectedBook(request.body);

    editBook(index, { ...books[index], ...protectedBook });

    saveFileToBook(request, books[index]);

    response.status(200);
    response.json(books[index]);
}

const remove = (request, response) => {
    const index = findBookIndex(request);

    if (index < 0) return returnNotFound(response);

    removeBook(index);

    response.status(200);
    response.json('ok');
}

const download = (request, response) => {
    const index = findBookIndex(request);

    if (index < 0) return returnNotFound(response);

    access(books[index].fileBook, constants.R_OK, (err) => {
        if (err) {
            editBook(index, { ...books[index], fileBook: '', fileName: '' });

            return returnNotFound(response);
        }

        response.status(200);
        response.download(books[index].fileBook);
    });
}

export { getAll, getById, create, edit, remove, download }
