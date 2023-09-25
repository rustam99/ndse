import { ChatModule } from '../../services/ChatModule/index.js'

export const chatController = {
  getHistory: async ({ id }, socket) => {
    try {
      const author = socket?.request?.session?.passport?.user?.id

      if (!author) return socket.disconnect()

      const chat = await ChatModule.find([author, id])

      if (chat instanceof Error) {
        return { status: 'error', error: chat.message }
      }

      if (!chat) {
        return { status: 'error', error: 'Чат не найден' }
      }

      const chatHistory = await ChatModule.getHistory(chat._id.toString())

      if (chatHistory instanceof Error) {
        return { status: 'error', error: chatHistory.message }
      }

      socket.emit('chatHistory', chatHistory)

      return { status: 'ok' }
    } catch (error) {
      return { status: 'error', error: error }
    }
  },
  sendMessage: async ({ receiver, text }, socket) => {
    try {
      const author = socket?.request?.session?.passport?.user?.id

      if (!author) return socket.disconnect()

      const result = await ChatModule.sendMessage({ author, receiver, text })

      if (result instanceof Error) {
        return { status: 'error', error: result.message }
      }

      return { status: 'ok' }
    } catch (error) {
      return { status: 'error', error: error }
    }
  },
}
