import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as passport from 'passport'
import { WsAdapter } from './adapters/ws.adapter'
import { sessionMiddleware } from './middleware/session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(sessionMiddleware)
  app.use(passport.initialize())
  app.use(passport.session())

  app.setGlobalPrefix('api')
  app.useWebSocketAdapter(new WsAdapter(sessionMiddleware, app))

  await app.listen(3000)
}

bootstrap()
