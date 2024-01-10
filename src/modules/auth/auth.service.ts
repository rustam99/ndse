import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { hash } from '../users/utils/hash'
import { timingSafeEqual } from 'crypto'
import { IUserPublic } from '../users/interfaces'
import { publicUser } from '../users/utils/publicUser'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<IUserPublic | null | Error> {
    const user = await this.usersService.findByEmail(username)

    if (user instanceof Error) return user

    if (!user) return null

    const hashedPassword = await hash(
      password,
      Buffer.from(user.passwordSalt, 'hex'),
    )

    if (
      !timingSafeEqual(Buffer.from(user.passwordHash, 'hex'), hashedPassword)
    ) {
      return null
    }

    return publicUser(user)
  }
}
