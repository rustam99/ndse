import { ISupportRequestPublic } from '../interfaces'
import { IUser } from '../../users/interfaces'

export interface ISupportRequestFormat {
  id: string
  createdAt: Date
  isActive: boolean
  hasNewMessages: boolean
  client?: IUser
}

export const supportRequestFormat = (
  supportRequest: ISupportRequestPublic,
  hasNewMessages: boolean,
  clientInResult = false,
) => {
  const result: ISupportRequestFormat = {
    id: supportRequest._id,
    createdAt: supportRequest.createdAt,
    isActive: supportRequest.isActive,
    hasNewMessages,
  }

  if (clientInResult) result.client = supportRequest.user

  return result
}
