import { Condition, HydratedDocument } from 'mongoose'
import { IUser, IUserRole } from '../../users/interfaces'
import { IMessageSendDto, ISupportRequestCreateDto } from './dto'
import { INumberOrNullOrError, IVoidOrNullOrError } from '../../../types/utils'
import { User } from '../../users/schemas/users.schema'

export interface IMessage {
  author: IUser
  sentAt: Date
  text: string
  readAt: Date | null
}

export interface ISupportRequest {
  user: IUser
  createdAt: Date
  messages: IMessage[]
  isActive: boolean
}

export type IMessageDocument = HydratedDocument<IMessage>
export type ISupportRequestDocument = HydratedDocument<IMessage>

export interface IMessagePublic extends IMessage {
  _id: IMessageDocument['id']
}

export interface ISupportRequestPublic extends ISupportRequest {
  _id: ISupportRequestDocument['id']
}

export interface ISupportRequestGetChatListParams {
  user?: string
  isActive?: boolean
}

export interface ISupportRequestService {
  findSupportRequests(
    params: ISupportRequestGetChatListParams,
  ): Promise<ISupportRequestPublic[] | Error>
  sendMessage(data: IMessageSendDto): Promise<IMessagePublic | Error | null>
  getMessages(supportRequest: string): Promise<IMessagePublic[] | Error>
  markMessagesAsRead(
    supportRequest: string,
    role: Exclude<IUserRole, 'admin'>,
  ): Promise<IVoidOrNullOrError>
  getUnreadCount(
    supportRequest: string,
    role: { role: Condition<User['role']> },
  ): Promise<INumberOrNullOrError>
  subscribe(
    handler: (
      supportRequest: ISupportRequestPublic,
      message: IMessagePublic,
    ) => void,
  ): void
}

export interface ISupportRequestClientService {
  createSupportRequest(
    data: ISupportRequestCreateDto,
  ): Promise<ISupportRequestPublic | Error>
  markMessagesAsRead(
    supportRequest: string,
  ): ReturnType<ISupportRequestService['markMessagesAsRead']>
  getUnreadCount(
    supportRequest: string,
  ): ReturnType<ISupportRequestService['getUnreadCount']>
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(
    supportRequest: string,
  ): ReturnType<ISupportRequestService['markMessagesAsRead']>
  getUnreadCount(
    supportRequest: string,
  ): ReturnType<ISupportRequestService['getUnreadCount']>
  closeRequest(supportRequest: string): Promise<IVoidOrNullOrError>
}
