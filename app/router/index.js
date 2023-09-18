import { bookViewsRoutes } from './bookViewsRoutes.js';
import { authViewsRoutes } from './authViewsRoutes.js';
import { authRoutes } from './authRoutes.js';
import { booksRoutes } from './booksRoutes.js';
import { bookComment } from "./bookCooment.js";

const useRouter = (app) => {
    authRoutes(app);
    booksRoutes(app);
    authViewsRoutes(app);
    bookViewsRoutes(app);
}

const useSocketRouter = (socket) => {
    bookComment(socket);
}

export { useRouter, useSocketRouter }
