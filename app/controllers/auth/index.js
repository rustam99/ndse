import { userModel } from '../../models/user.js';
import passport from 'passport';

export const login = async (request, response) => {
    passport.authenticate('local')(request, response, function () {
        const prevSession = request.session;

        request.session.regenerate(() => {
            Object.assign(request.session, prevSession);

            return response.json({ message: 'ok' })
        });
    });
}

export const signup = async (request, response) => {
    const { login, username, password } = request.body;

    userModel.register(new userModel({ login, displayName: username }), password, function (err) {
        if (err) {
            return response.status(400).json({ status: 400, message: err });
        }

        passport.authenticate('local')(request, response, function () {
            const prevSession = request.session;

            request.session.regenerate(() => {
                Object.assign(request.session, prevSession);

                return response.json({ message: 'ok' })
            });
        });
    });
}

export const logout = (request, response, next) => {
    request.logout(function(err) {
        if (err) return next(err);

        response.json({ message: 'ok' });
    });
}
