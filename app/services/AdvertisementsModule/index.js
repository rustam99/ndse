import { advertisementModel } from '../../models/advertisement.js'

export const AdvertisementsModule = {
  find: async (params) => {
    try {
      return advertisementModel
        .find({
          $or: [
            { shortText: new RegExp(params) },
            { description: new RegExp(params) },
            { userId: params },
            { tags: { $all: [params] } },
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
