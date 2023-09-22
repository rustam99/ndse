import { chatModel } from '../../models/chat.js'
import { messageModel } from '../../models/message.js'
import mongoose from 'mongoose'
import { SendMessageEvent } from '../../events/sendMessageEvent.js'
import { eventBus } from '../../utils/eventBus.js'

export const ChatModule = {
  find: async (users) => {
    try {
      if (!users) return new Error('Отсутствует обязательное поле - users')
      if (!Array.isArray(users)) return new Error('Не верный формат данных')

      for (const userId of users) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return new Error('Не верный формат id')
        }
      }

      return chatModel.findOne({ users: { $all: users } }).exec()
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  sendMessage: async ({ author, receiver, text }) => {
    try {
      if (!author) return new Error('Отсутствует обязательное поле - author')
      if (!receiver)
        return new Error('Отсутствует обязательное поле - receiver')

      if (!mongoose.Types.ObjectId.isValid(author)) {
        return new Error('Не верный формат author')
      }

      if (!mongoose.Types.ObjectId.isValid(receiver)) {
        return new Error('Не верный формат receiver')
      }

      const createdMessage = await messageModel.create({
        author,
        text,
      })

      const chat = await ChatModule.find([author, receiver])

      if (!chat) {
        const createdChat = await chatModel.create({
          users: [author, receiver],
          messages: [createdMessage],
        })

        new SendMessageEvent({
          chatId: createdChat._id,
          message: createdMessage,
        })

        return createdMessage
      }

      await messageModel
        .updateMany(
          {
            author: receiver,
            $and: [
              { sentAt: { $lte: Date.now() } },
              { readAt: { $exists: false } },
            ],
          },
          {
            readAt: Date.now(),
          },
        )
        .exec()

      chat.messages.push(createdMessage)

      await chat.save()

      new SendMessageEvent({ chatId: chat._id, message: createdMessage })
      return createdMessage
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  subscribe: (cb) => {
    eventBus.on(SendMessageEvent.name, cb)
  },
  getHistory: async (id) => {
    try {
      if (!id) return new Error('Отсутствует обязательное поле - id')
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return new Error('Не верный формат id')
      }

      return chatModel.findById(id).populate('messages').exec()
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
