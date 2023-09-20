import mongoose from 'mongoose'
import { advertisementModel } from '../../models/advertisement.js'
import { AdvertisementsModule } from '../../services/AdvertisementsModule/index.js'

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
      return response.status(500).json({ status: 'error', error })
    }
  },
  one: async (request, response) => {
    try {
      const { id } = request.params

      if (!mongoose.Types.ObjectId.isValid(id))
        return response
          .status(404)
          .json({ status: 'error', error: 'Не найдено' })

      const data = await advertisementModel.findById(id).exec()

      if (!data)
        return response
          .status(404)
          .json({ status: 'error', error: 'Не найдено' })

      return response.json({ status: 'ok', data })
    } catch (error) {
      return response.status(500).json({ status: 'error', error })
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
        return response
          .status(400)
          .json({ status: 'error', error: result.message })
      }

      return response.json({ status: 'ok', data: result })
    } catch (error) {
      return response.status(500).json({ status: 'error', error })
    }
  },
  remove: async (request, response) => {
    try {
      const { id } = request.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return response
          .status(404)
          .json({ status: 'error', error: 'Не найдено' })
      }

      const result = await AdvertisementsModule.remove(id)

      if (request.user.id !== result.user._id.toString()) {
        return response
          .status(403)
          .json({ status: 'error', error: 'У вас не хватает прав' })
      }

      return response.json({ status: 'ok', data: result })
    } catch (error) {
      return response.status(500).json({ status: 'error', error })
    }
  },
}
