import { Schema, model } from 'mongoose'

const advertisementSchema = new Schema({
  shortText: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  __v: {
    type: Number,
    select: false,
  },
})

export const advertisementModel = model('Advertisement', advertisementSchema)
