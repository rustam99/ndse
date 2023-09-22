import { ChatController } from '../controllers/chat/index.js'
import { onSocket } from '../utils/onSocket.js'

export const chatRoutes = (socket) => {
  const controller = new ChatController(socket)

  onSocket('getHistory', socket, controller.getHistory)
  onSocket('sendMessage', socket, controller.sendMessage)
}
