import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/users.schema'
import { Model, isValidObjectId } from 'mongoose'
import { randomBytes } from 'crypto'
import { publicUser } from './utils/publicUser'
import { hash } from './utils/hash'
import { errorDictionary } from '../../utils/errorDictionary'
import { usersErrorDictionary } from './utils/usersErrorDictionary'
import {
  IUserCreateDto,
  IUserPrivate,
  IUserPublic,
  IUserSearchParams,
  IUserService,
} from './interfaces'
import { regexStringFilter } from '../../utils/regexFilter'

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) {}

  private hideSelectPrivateFields() {
    return '-passwordHash -passwordSalt'
  }

  async create(userDto: IUserCreateDto): Promise<IUserPublic | Error> {
    try {
      const salt = randomBytes(16)
      const hashedPassword = await hash(userDto.password, salt)

      const user = await this.usersModel.create({
        email: userDto.email,
        name: userDto.name,
        passwordHash: hashedPassword.toString('hex'),
        passwordSalt: salt.toString('hex'),
        contactPhone: userDto?.contactPhone,
        role: userDto.role ?? 'client',
      })

      return publicUser(user)
    } catch (error) {
      if (/duplicate key error/.test(error?.message)) {
        return new Error(usersErrorDictionary.emailIsBusy)
      }

      return error
    }
  }

  async findById(id: string): Promise<IUserPublic | null | Error> {
    try {
      if (!isValidObjectId(id))
        return new Error(errorDictionary.invalidIdFormat())

      const user = await this.usersModel
        .findById(id)
        .select(this.hideSelectPrivateFields())

      if (!user) return null

      return user
    } catch (error) {
      return error
    }
  }

  async findByEmail(email: string): Promise<IUserPrivate | null | Error> {
    try {
      const user = await this.usersModel.findOne({ email })

      if (!user) return null

      return user
    } catch (error) {
      return error
    }
  }

  async findAll(params: IUserSearchParams): Promise<IUserPublic[]> {
    const filter = []

    if (params.name) {
      filter.push({ name: regexStringFilter(params.name) })
    }

    if (params.email) {
      filter.push({ email: regexStringFilter(params.email) })
    }

    if (params.contactPhone) {
      filter.push({
        contactPhone: regexStringFilter(params.contactPhone),
      })
    }

    if (!params.limit) {
      return this.usersModel
        .find({
          $or: filter,
        })
        .select(this.hideSelectPrivateFields())
        .skip(params.offset ?? 0)
    }

    return this.usersModel
      .find({
        $or: filter,
      })
      .select(this.hideSelectPrivateFields())
      .skip(params.offset ?? 0)
      .limit(params.limit)
  }
}
