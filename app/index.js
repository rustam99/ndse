import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import passport from 'passport'

import { config } from './config.js'
import { router } from './router/index.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.json())

const sessionMiddleware = session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: config.MONGO_URL }),
})

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

router(app)
;(async function () {
  try {
    await mongoose.connect(config.MONGO_URL)

    io.use((socket, next) => {
      sessionMiddleware(socket.request, {}, next)
    }).on('connection', (socket) => {
      console.log('SOCKET')
    })

    httpServer.listen(
      config.HTTP_PORT,
      () => `server start on port ${config.HTTP_PORT}`,
    )
  } catch (e) {
    console.log(e)
  }
})()
