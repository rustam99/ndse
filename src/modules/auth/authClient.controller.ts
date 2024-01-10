import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Request,
  Response,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { IAuthSignUpDto } from './interfaces'
import { UsersService } from '../users/users.service'
import { usersErrorDictionary } from '../users/utils/usersErrorDictionary'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Response as ExpressResponse } from 'express'

@Controller('client')
export class AuthClientController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async signUp(@Body() signUpDto: IAuthSignUpDto) {
    const user = await this.usersService.create(signUpDto)

    if (user instanceof Error) {
      if (user.message === usersErrorDictionary.emailIsBusy) {
        throw new BadRequestException(user.message, user.name)
      }

      throw new InternalServerErrorException(user.message, user.name)
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
    }
  }

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
