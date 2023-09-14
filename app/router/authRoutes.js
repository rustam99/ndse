import passport from 'passport';
import passportLocal from 'passport-local';
import { verify } from '../controllers/auth/verify.js';
import { login, signup, logout } from '../controllers/auth/index.js'

const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy({
    usernameField: 'login',
}, verify));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, {
            id: user.id,
            login: user.login,
            displayName: user.displayName,
        });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

export const authRoutes = (app) => {
    app.post('/api/user/login', login);
    app.post('/api/user/signup', signup);
    app.post('/api/user/logout', logout);
}
