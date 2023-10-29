import { Express } from 'express'
import { index, create, update, view } from '../controllers/bookViews'

export const bookViewsRoutes = (app: Express) => {
    app.get('/', index);
    app.get('/view/:id', view);
    app.get('/create', create);
    app.get('/update/:id', update);
}
