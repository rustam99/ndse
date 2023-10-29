import { Express } from 'express'
import { auth } from '../controllers/auth'


export const authRoutes = (app: Express) => {
    app.post('/api/user/login', auth);
}
