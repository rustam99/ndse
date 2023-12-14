import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { User } from './schemas/users.schema'
import { ISignUpDto } from '../auth/interfaces/dto'
import { randomBytes } from 'crypto'
import { hash } from '../../utils/hash'
import { IUserPublic } from './interfaces/User'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}

  async create(dto: ISignUpDto): Promise<IUserPublic | Error> {
    try {
      const salt = randomBytes(16)
      const hashedPassword = await hash(dto.password, salt)

      const user = await this.usersModel.create({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hashedPassword.toString('hex'),
        salt: salt.toString('hex'),
      })

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (/duplicate key error/.test(error?.message)) {
        return new Error('Email занят')
      }

      throw error
    }
  }

  async findByEmail(email: string) {
    return this.usersModel.findOne({ email })
  }
}
