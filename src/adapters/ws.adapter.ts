import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import express from 'express'
import * as passport from 'passport'

export class WsAdapter extends IoAdapter {
  private readonly session: express.RequestHandler

  constructor(session: express.RequestHandler, app: INestApplicationContext) {
    super(app)

    this.session = session
  }

  create(port: number, options?: any): any {
    const server = super.createIOServer(port, options)

    const wrap = (middleware: any) => (socket: any, next: any) =>
      middleware(socket.request, {}, next)

    server.use(wrap(this.session))
    server.use(wrap(passport.initialize()))
    server.use(wrap(passport.session()))

    return server
  }
}
