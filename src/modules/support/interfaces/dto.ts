import { IUserRole } from '../../users/interfaces'
import { ISupportRequestGetChatListParams } from './index'

export interface ISupportRequestCreateDto {
  user: string
  text: string
}

export interface IMessageSendDto {
  author: string
  supportRequest: string
  text: string
}

export interface IMessageUpdateDto {
  text: string
  readAt: Date
}

export interface ISupportRequestQueryParams
  extends Omit<ISupportRequestGetChatListParams, 'user'> {}

export interface ISupportRequestMarkMessagesAsReadDto {
  supportRequest: string
  createdBefore: Date
  role: Exclude<IUserRole, 'admin'>
}
