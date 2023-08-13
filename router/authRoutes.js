import { auth } from '../controllers/auth/index.js'


export const authRoutes = (app) => {
    app.post('/api/user/login', auth);
}
