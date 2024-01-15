import { Config } from '../config'
import * as session from 'express-session'

export const sessionMiddleware = session({
  secret: Config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
})
