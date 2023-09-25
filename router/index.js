import { authRoutes } from './auth.js'
import { advertisementsRoutes } from './advertisements.js'
import { chatRoutes } from './chat.js'

export const router = (app) => {
  authRoutes(app)
  advertisementsRoutes(app)
}

export const socketRouter = (socket) => {
  chatRoutes(socket)
}
