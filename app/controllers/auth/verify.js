import { userModel } from '../../models/user.js';
import { timingSafeEqual } from 'crypto';
import { hashPassword } from '../../utils/hashPassword.js';

export const verify = async (login, password, cb) => {
    try {
        const user = await userModel.findOne({ login }).exec();

        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password' });
        }

        const hashedPassword = await hashPassword(password, Buffer.from(user.salt, 'hex'));

        if (!timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword)) {
            return cb(null, false, { message: 'Incorrect username or password' });
        }

        return cb(null, user);
    } catch (error) {
        return cb(error);
    }
}
