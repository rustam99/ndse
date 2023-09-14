import { userModel } from '../../models/user.js';
import passport from 'passport';
import { randomBytes } from 'crypto';
import { hashPassword } from '../../utils/hashPassword.js';

export const login = async (request, response) => {
    passport.authenticate('local')(request, response, function () {
        const prevSession = request.session;

        request.session.regenerate(() => {
            Object.assign(request.session, prevSession);

            return response.json({ message: 'ok' })
        });
    });
}

export const signup = async (request, response, next) => {
    const { login, username, password } = request.body;

    try {
        const salt = randomBytes(16);
        const hashedPassword = await hashPassword(password, salt);
        const user = await userModel.create({
            login,
            displayName: username,
            password: hashedPassword.toString('hex'),
            salt: salt.toString('hex'),
        });

        request.login(user, (err) => {
            if (err) return response.status(500).json({ status: 500, message: err });

            return response.json({ message: 'ok' });
        });
    } catch (error) {
        if (/duplicate key error/.test(error.message)) {
            return response.status(401).json({ status: 401, message: 'UserExistsError' });
        }

        return response.status(500).json({ status: 500, message: error });
    }
}

export const logout = (request, response, next) => {
    request.logout(function(err) {
        if (err) return next(err);

        response.json({ message: 'ok' });
    });
}
