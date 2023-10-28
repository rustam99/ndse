import { access, constants, mkdir, rm } from 'fs'
import { join } from "path";
import { rootPath } from '../../utils/root.js';
import { returnNotFound } from '../../utils/returnNotFound.js';
import { config } from '../../config.js';
import { container } from '../../container.js'
import { BookRepository } from '../../serveices/BooksRepository.js'

const service = container.get(BookRepository);

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

const getAndUpdateFileUpload = (request, fileBook = null) => {
    if (!request.file) return null;

    const { path, filename } = request.file;

    if (fileBook) {
        deleteFileBook(fileBook);
    }

    return { fileName: filename, fileBook: path }
}

const deleteFileBook = (fileBook) => {
    rm(fileBook, (err) => {
        if (err) console.log('Не удалось удалить предыдущий файл, возможно был уже удален');
    });
}

const getAll = async (request, response) => {
    try {
        const books = await service.getAll()

        response.json(books);
    } catch (e) {
        response.status(500);
        response.json(e);
    }
}

const getById = async (request, response) => {
    try {
        const { id } = request.params;

        const book = await service.getOne(id)

        if (!book) return returnNotFound(response);

        response.json(book);
    } catch (e) {
        return response.status(500).json(e);
    }
}

const create = async (request, response) => {
    const book = request.body

    const fileData = getAndUpdateFileUpload(request);

    if (fileData) {
        book.fileName = fileData.fileName;
        book.fileBook = fileData.fileBook;
    }

    try {
        const newBook = await service.create(book);

        response.status(201);
        response.json(newBook);
    } catch (e) {
        response.status(500);
        response.json(e);
    }
}

const edit = async (request, response) => {
    const { id } = request.params;

    try {
        const book = await service.getOne(id);
        const data = {}

        if (!book) return returnNotFound(response);

        for (const key in request.body) {
            data[key] = request.body[key];
        }

        const fileData = getAndUpdateFileUpload(request, book.fileBook);

        if (fileData) {
            data.fileBook = fileData.fileBook;
            data.fileName = fileData.fileName;
        }

        const saved = await service.edit(id, data);

        response.json(saved);
    } catch (e) {
        response.status(500).json(e);
    }
}

const remove = async (request, response) => {
    const { id } = request.params;

    try {
        const deletedBook = await service.remove(id);

        if (!deletedBook) return returnNotFound(response);

        if (deletedBook.fileBook) {
            deleteFileBook(deletedBook.fileBook);
        }

        return response.json({ status: 'ok' });
    } catch (e) {
        return response.status(500).json(e);
    }
}

const download = async (request, response) => {
    const { id } = request.params;

    try {
        const book = await service.getOne(id);

        if (!book) return returnNotFound(response);

        if (!book.fileBook) return response.status(200).json({ status: false, message: 'Файл не был прикреплен' });

        response.download(book.fileBook, book.fileBook, (err) => {
            if (err) {
                book.fileBook = '';
                book.fileName = '';

                book.save();

                return response.status(409).json({ status: false, message: 'Файл не был найден' });
            }
        });
    } catch (e) {
        return response.status(500).json(e);
    }
}

export { getAll, getById, create, edit, remove, download }
