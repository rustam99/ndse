import { Schema, model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    displayName: {
        type: String,
    },
    __v: {
        type: Number,
        select: false,
    },
});

userSchema.plugin(passportLocalMongoose, {
    hashField: 'password',
    usernameField: 'login',
});

export const userModel = model('User', userSchema);
