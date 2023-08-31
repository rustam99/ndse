import { access, constants, mkdir, rm } from 'fs'
import { join } from "path";
import { rootPath } from '../../utils/root.js';
import { returnNotFound } from '../../utils/returnNotFound.js';
import { config } from '../../config.js';
import { bookModel } from '../../models/book.js';
import mongoose from 'mongoose';

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
        const books = await bookModel.find().exec();

        response.json(books);
    } catch (e) {
        response.status(500);
        response.json(e);
    }
}

const getById = async (request, response) => {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return returnNotFound(response);

        const book = await bookModel.findById(id).exec();

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
        const newBook = await bookModel.create(book);

        response.status(201);
        response.json(newBook);
    } catch (e) {
        response.status(500);
        response.json(e);
    }
}

const edit = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return returnNotFound(response);

    try {
        const book = await bookModel.findById(id).exec();

        if (!book) return returnNotFound(response);

        for (const key in request.body) {
            if (key in book) book[key] = request.body[key];
        }

        const fileData = getAndUpdateFileUpload(request, book.fileBook);

        if (fileData) {
            book.fileBook = fileData.fileBook;
            book.fileName = fileData.fileName;
        }

        book.save();

        response.json(book);
    } catch (e) {
        response.status(500).json(e);
    }
}

const remove = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return returnNotFound(response);

    try {
        const deletedBook = await bookModel.findByIdAndDelete(id).exec();

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

    if (!mongoose.Types.ObjectId.isValid(id)) return returnNotFound(response);

    try {
        const book = await bookModel.findById(id).exec();

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
