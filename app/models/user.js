import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    login: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    salt: {
        type: String,
    },
    displayName: {
        type: String,
    },
    __v: {
        type: Number,
        select: false,
    },
});

export const userModel = model('User', userSchema);
