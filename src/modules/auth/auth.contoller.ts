import {
  Controller,
  UseGuards,
  Post,
  Request,
  Response,
  HttpStatus,
} from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Response as ExpressResponse } from 'express'

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request) {
    return {
      email: request?.user?.email,
      name: request?.user?.name,
      contactPhone: request?.user?.contactPhone,
    }
  }

  @Post('logout')
  async logout(@Request() request, @Response() response: ExpressResponse) {
    request.session.destroy()

    response.status(HttpStatus.NO_CONTENT).send()
  }
}
