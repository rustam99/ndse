import { auth } from '../controllers/auth.js';
import { getAll, getById, create, edit, remove, download } from '../controllers/book.js';
import { upload } from '../middleware/file.js';

const useRouter = (app) => {
    app.post('/api/user/login', auth);
    app.get('/api/books', getAll);
    app.get('/api/books/:id', getById);
    app.post('/api/books', upload.single('fileBook'), create);
    app.put('/api/books/:id', upload.single('fileBook'), edit);
    app.delete('/api/books/:id', remove);
    app.get('/api/books/:id/download', download)
}

export { useRouter }
