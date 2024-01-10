import { IUserDocument, IUserPrivate, IUserPublic } from '../interfaces'

export const publicUser = (user: IUserDocument | IUserPrivate): IUserPublic => {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    contactPhone: user.contactPhone,
    role: user.role,
  }
}
