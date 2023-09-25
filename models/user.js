import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  passwordSalt: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
  },
  __v: {
    type: Number,
    select: false,
  },
})

export const userModel = model('User', userSchema)
