import passport from 'passport';
import { userModel } from '../models/user.js';
import { login, signup, logout } from '../controllers/auth/index.js'

passport.use(userModel.createStrategy())
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

export const authRoutes = (app) => {
    app.post('/api/user/login', login);
    app.post('/api/user/signup', signup);
    app.post('/api/user/logout', logout);
}
