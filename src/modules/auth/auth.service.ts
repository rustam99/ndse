import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { hash } from '../../utils/hash'
import { timingSafeEqual } from 'crypto'
import { IUserPublic } from '../users/interfaces/User'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<IUserPublic | null> {
    const user = await this.usersService.findByEmail(username)

    if (!user) return null

    const hashedPassword = await hash(password, Buffer.from(user.salt, 'hex'))

    if (!timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword)) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }

  async login(user: IUserPublic) {
    return {
      accessToken: this.jwtService.sign(user),
    }
  }
}
