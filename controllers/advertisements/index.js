import mongoose from 'mongoose'
import { advertisementModel } from '../../models/advertisement.js'
import { AdvertisementsModule } from '../../services/AdvertisementsModule/index.js'
import { responseErrors } from '../../utils/responseErrors.js'
import { removeFiles } from '../../utils/removeFiles.js'

export const AdvertisementsController = {
  all: async (request, response) => {
    try {
      const data = await advertisementModel
        .find()
        .populate({
          path: 'user',
          select: '-email -passwordHash -passwordSalt -contactPhone',
        })
        .exec()

      return response.json({ status: 'ok', data })
    } catch (error) {
      return responseErrors.internal(response, error)
    }
  },
  one: async (request, response) => {
    try {
      const { id } = request.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return responseErrors.notFound(response)
      }

      const data = await advertisementModel.findById(id).exec()

      if (!data) {
        return responseErrors.notFound(response)
      }

      return response.json({ status: 'ok', data })
    } catch (error) {
      return responseErrors.internal(response, error)
    }
  },
  add: async (request, response) => {
    try {
      const { shortText, userId, description, tags } = request.body
      const data = { shortText, userId }

      if (description) data.description = description
      if (tags) data.tags = tags

      if (request.files) {
        data.images = request.files.map((file) => file.path)
      }

      const result = await AdvertisementsModule.create(data)

      if (result instanceof Error) {
        return responseErrors.badRequest(response, result.message)
      }

      return response.json({ status: 'ok', data: result })
    } catch (error) {
      return responseErrors.internal(response, error)
    }
  },
  edit: async (request, response) => {
    try {
      const { id } = request.params
      const toChangeData = { ...request.body }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return responseErrors.notFound(response)
      }

      const advertisements = await advertisementModel.findById(id).exec()

      if (!advertisements) return responseErrors.notFound(response)

      if (typeof toChangeData.images !== 'undefined') {
        toChangeData.images = []

        removeFiles(advertisements.images)
      }

      if (request?.files?.length) {
        toChangeData.images = request.files.map((file) => file.path)

        removeFiles(advertisements.images)
      }

      for (const field in toChangeData) {
        if (field in advertisements) {
          advertisements[field] = toChangeData[field]
        }
      }

      const result = await advertisements.save()

      return response.json({ status: 'ok', data: result })
    } catch (error) {
      return responseErrors.internal(response, error)
    }
  },
  remove: async (request, response) => {
    try {
      const { id } = request.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return responseErrors.notFound(response)
      }

      const result = await AdvertisementsModule.remove(id)

      if (request.user.id !== result.user._id.toString()) {
        return responseErrors.forbidden(response)
      }

      return response.json({ status: 'ok', data: result })
    } catch (error) {
      return responseErrors.internal(response, error)
    }
  },
}
