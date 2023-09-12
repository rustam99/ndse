import { bookViewsRoutes } from './bookViewsRoutes.js';
import { authViewsRoutes } from './authViewsRoutes.js';
import { authRoutes } from './authRoutes.js';
import { booksRoutes } from './booksRoutes.js';

const useRouter = (app) => {
    authRoutes(app);
    booksRoutes(app);
    authViewsRoutes(app);
    bookViewsRoutes(app);
}

export { useRouter }
