import { bookViewsRoutes } from './bookViewsRoutes.js';
import { authRoutes } from './authRoutes.js';
import { booksRoutes } from './booksRoutes.js';

const useRouter = (app) => {
    authRoutes(app);
    booksRoutes(app);
    bookViewsRoutes(app);
}

export { useRouter }
