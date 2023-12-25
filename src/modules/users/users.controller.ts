import {
  Controller,
  BadRequestException,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { IUserCreateDto } from './interfaces'

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('')
  async create() {
    const result = await this.userService.findAll({ email: '.ru' })

    if (result instanceof Error) {
      return new BadRequestException(result.name, result.message)
    }

    if (!result) return new NotFoundException()

    return result
  }
}
