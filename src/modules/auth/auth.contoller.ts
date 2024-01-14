import {
  Controller,
  UseGuards,
  Post,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'

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
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() request) {
    request.session.destroy()
  }
}
