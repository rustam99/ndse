import { Express } from 'express'
import { bookViewsRoutes } from './bookViewsRoutes.js';
import { authRoutes } from './authRoutes.js';
import { booksRoutes } from './booksRoutes.js';

const useRouter = (app: Express) => {
    authRoutes(app);
    booksRoutes(app);
    bookViewsRoutes(app);
}

export { useRouter }
