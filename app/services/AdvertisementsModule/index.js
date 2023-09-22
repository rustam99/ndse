import { advertisementModel } from '../../models/advertisement.js'
import mongoose from 'mongoose'

export const AdvertisementsModule = {
  find: async (params) => {
    try {
      if (mongoose.Types.ObjectId.isValid(params)) {
        return advertisementModel.findOne({
          user: params,
          $and: [{ isDeleted: false }],
        })
      }

      return advertisementModel
        .find({
          $or: [
            { shortText: { $regex: new RegExp(params, 'i') } },
            { description: { $regex: new RegExp(params, 'i') } },
            { tags: { $in: Array.isArray(params) ? params : [params] } },
          ],
          $and: [{ isDeleted: false }],
        })
        .exec()
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  create: async ({
    shortText,
    userId,
    description = '',
    images = [],
    tags = [],
    isDeleted = false,
    createdAt = Date.now(),
    updatedAt = Date.now(),
  }) => {
    try {
      if (!shortText) {
        return new Error('Отсутствует обязательное поле - shortText')
      }

      if (!userId) {
        return new Error('Отсутствует обязательное поле - userId')
      }

      return advertisementModel.create({
        shortText,
        user: userId,
        description,
        images,
        tags,
        isDeleted,
        createdAt,
        updatedAt,
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  remove: async (id) => {
    try {
      if (!id) return new Error('Отсутствует обязательное поле - id')

      return advertisementModel
        .findByIdAndUpdate(id, { isDeleted: true })
        .exec()
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
