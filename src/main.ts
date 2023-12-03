import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from './config'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { HttpExceptionFilter } from './exceptionFilters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(config.HTTP_PORT)
}
bootstrap()
