import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/users.schema'
import { Model, isValidObjectId } from 'mongoose'
import { randomBytes } from 'crypto'
import { publicUser } from './utils/publicUser'
import { hash } from './utils/hash'
import { ErrorDictionary } from '../../utils/errorDictionary'
import { UsersErrorDictionary } from './utils/usersErrorDictionary'
import {
  IUserCreateDto,
  IUserPublic,
  IUserSearchParams,
  IUserService,
} from './interfaces'

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
        return new Error(UsersErrorDictionary.emailIsBusy)
      }

      return error
    }
  }

  async findById(id: string): Promise<IUserPublic | null | Error> {
    try {
      if (!isValidObjectId(id))
        return new Error(ErrorDictionary.invalidIdFormat)

      const user = await this.usersModel
        .findById(id)
        .select(this.hideSelectPrivateFields())

      if (!user) return null

      return user
    } catch (error) {
      return error
    }
  }

  async findByEmail(email: string): Promise<IUserPublic | null | Error> {
    try {
      const user = await this.usersModel
        .findOne({ email })
        .select(this.hideSelectPrivateFields())

      if (!user) return null

      return user
    } catch (error) {
      return error
    }
  }

  async findAll(params: IUserSearchParams): Promise<IUserPublic[]> {
    const filter = []

    if (params.name)
      filter.push({ name: { $regex: new RegExp(params.name, 'i') } })
    if (params.email)
      filter.push({ email: { $regex: new RegExp(params.email, 'i') } })
    if (params.contactPhone)
      filter.push({
        contactPhone: { $regex: new RegExp(params.contactPhone, 'i') },
      })

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
