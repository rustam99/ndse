import { create, index, view, update } from '../controllers/bookViews/index.js';

export const bookViewsRoutes = (app) => {
    app.get('/', index);
    app.get('/view/:id', view);
    app.get('/create', create);
    app.get('/update/:id', update);
}
