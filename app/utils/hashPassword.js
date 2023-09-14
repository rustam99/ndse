import { pbkdf2 } from "crypto";

export const hashPassword = (password, salt) => {
    return new Promise((resolve, reject) => {
        pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) return reject(err);

            return resolve(hashedPassword);
        });
    });
}
