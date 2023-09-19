import { authRoutes } from './auth.js'
import { advertisementsRoutes } from './advertisements.js'

export const router = (app) => {
  authRoutes(app)
  advertisementsRoutes(app)
}

export const socketRouter = () => {}
