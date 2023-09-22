import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  sentAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  readAt: {
    type: Date,
  },
  __v: {
    type: Number,
    select: false,
  },
})

export const messageModel = model('Message', messageSchema)
