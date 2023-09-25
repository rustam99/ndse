import { chatController } from '../controllers/chat/index.js'
import { ChatModule } from '../services/ChatModule/index.js'
import { onSocket } from '../utils/onSocket.js'

export const chatRoutes = (socket) => {
  ChatModule.subscribe((message) => {
    socket.broadcast.emit('newMessage', message)
    socket.emit('newMessage', message)
  })

  onSocket('getHistory', socket, chatController.getHistory, true)
  onSocket('sendMessage', socket, chatController.sendMessage, true)
}
