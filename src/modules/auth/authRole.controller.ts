import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { IAuthSignUpDto } from './interfaces'
import { UsersService } from '../users/users.service'
import { usersErrorDictionary } from '../users/utils/usersErrorDictionary'
import { IUserCreateDto, IUserSearchParams } from '../users/interfaces'
import { AuthenticatedRoleGuard } from '../../guards/AuthenticatedRoleGuard.guard'
import { usersRoles } from '../users/utils/usersRoles'

@Controller('')
export class AuthRoleController {
  constructor(private readonly usersService: UsersService) {}

  @Post('client/register')
  async clientSignUp(@Body() signUpDto: IAuthSignUpDto) {
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

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.admin))
  @Post('admin/users')
  async createUser(@Body() signUpDto: IUserCreateDto) {
    const user = await this.usersService.create(signUpDto)

    if (user instanceof Error) {
      throw new BadRequestException(user.message, user.name)
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    }
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.admin))
  @Get('admin/users')
  async getAdminUsers(@Query() params: IUserSearchParams) {
    return await this.usersService.findAll(params)
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.manager))
  @Get('manager/users')
  async getManagerUsers(@Query() params: IUserSearchParams) {
    return await this.usersService.findAll(params)
  }
}
