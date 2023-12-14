import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { ISignUpDto } from './interfaces/dto'
import { UsersService } from '../users/users.service'
import { JoiValidationPipe } from '../../pipes/joi.validation.pipe'
import { signUpSchema } from './validation/schemas'

@Controller('api/users')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  // eslint-disable-next-line
  async signIn(@Request() req: any) {
    return this.authService.login(req.user)
  }

  @UsePipes(new JoiValidationPipe(signUpSchema))
  @Post('signUp')
  async signUp(@Body() signUpDto: ISignUpDto) {
    const user = await this.usersService.create(signUpDto)

    if (user instanceof Error) {
      return new BadRequestException(user.name, user.message)
    }

    return user
  }
}
