import { HydratedDocument } from 'mongoose'
import { User } from '../schemas/users.schema'
import { IUserCreateDto } from './dto'

export type IUserRole = 'admin' | 'manager' | 'client'
export type IUserDocument = HydratedDocument<User>
export interface IUser {
  email: string
  passwordHash: string
  passwordSalt: string
  name: string
  contactPhone: string
  role: IUserRole
}

export type IUserPrivateFields = 'passwordHash' | 'passwordSalt'
export interface IUserPublic extends Omit<IUser, IUserPrivateFields> {
  _id: IUserDocument['id']
}

export interface IUserPrivate extends IUser {
  _id: IUserDocument['id']
}

export interface IUserSearchParams {
  limit?: number
  offset?: number
  email?: IUser['email']
  name?: IUser['name']
  contactPhone?: IUser['contactPhone']
}

export interface IUserService {
  create(user: IUserCreateDto): Promise<IUserPublic | Error>
  findById(id: string): Promise<IUserPublic | IUserPrivate | null | Error>
  findByEmail(email: string): Promise<IUserPublic | null | Error>
  findAll(params: IUserSearchParams): Promise<IUserPublic[]>
}

export { IUserCreateDto }
