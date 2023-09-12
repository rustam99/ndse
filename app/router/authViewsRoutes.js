import { login, profile } from '../controllers/authViews/index.js';
import { checkAuth } from '../utils/checkAuth.js';

export const authViewsRoutes = (app) => {
    app.get('/user/login/', login);
    app.get('/user/me/', checkAuth, profile);
}
