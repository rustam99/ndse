import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    if (status < 500) {
      return response.status(status).json(exception.getResponse())
    }

    response.status(status).json({
      timestamp: Date.now(),
      status: 'fail',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      data: exception.getResponse(),
    })
  }
}
