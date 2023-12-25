import { IUser, IUserRole } from './index'

export interface IUserCreateDto
  extends Omit<
    IUser,
    'passwordSalt' | 'role' | 'passwordHash' | 'contactPhone'
  > {
  password: string
  contactPhone?: string
  role?: IUserRole
}
