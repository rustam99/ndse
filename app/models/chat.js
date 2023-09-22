import { Schema, model } from 'mongoose'

const chatSchema = new Schema({
  users: [
    { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  __v: {
    type: Number,
    select: false,
  },
})

export const chatModel = model('Chat', chatSchema)
