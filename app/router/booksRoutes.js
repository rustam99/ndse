import { create, download, edit, getAll, getById, remove } from '../controllers/book/index.js';
import { upload } from '../middleware/file.js';

export const booksRoutes = (app) => {
    app.get('/api/books', getAll);
    app.get('/api/books/:id', getById);
    app.post('/api/books', upload.single('fileBook'), create);
    app.put('/api/books/:id', upload.single('fileBook'), edit);
    app.delete('/api/books/:id', remove);
    app.get('/api/books/:id/download', download)
}
