import { IUserDocument, IUserPublic } from '../interfaces'

export const publicUser = (user: IUserDocument): IUserPublic => {
  return {
    _id: user.id,
    email: user.email,
    name: user.name,
    contactPhone: user.contactPhone,
    role: user.role,
  }
}
