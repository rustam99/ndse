import { auth } from '../controllers/auth';
import { getAll, getById, create, edit, remove } from '../controllers/book';
import { Express } from 'express'

const useRouter = (app: Express) => {
    app.post('/api/user/login', auth);
    app.get('/api/books', getAll);
    app.get('/api/books/:id', getById);
    app.post('/api/books', create);
    app.put('/api/books/:id', edit);
    app.delete('/api/books/:id', remove);
}

export { useRouter }
