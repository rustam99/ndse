import { Injectable } from '@nestjs/common'
import { Condition, Error, FilterQuery, isValidObjectId, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { SupportRequest } from './schemas/supportRequest.schema'
import { Message } from './schemas/message.schema'
import { SendMessageEvent } from './events/sendMessageEvent'
import { errorDictionary } from '../../utils/errorDictionary'
import { eventBus } from '../../utils/eventBus'
import {
  IMessagePublic,
  ISupportRequestGetChatListParams,
  ISupportRequestPublic,
  ISupportRequestService,
} from './interfaces'
import { IMessageSendDto } from './interfaces/dto'
import { IVoidOrNullOrError } from '../../types/utils'
import { User } from '../users/schemas/users.schema'
import { IUserRole } from '../users/interfaces'

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async findSupportRequests(
    params: ISupportRequestGetChatListParams,
  ): Promise<ISupportRequestPublic[] | Error> {
    try {
      if (params.user && !isValidObjectId(params.user))
        return new Error(errorDictionary.invalidIdFormat('user'))

      const filter: FilterQuery<SupportRequest> = {}

      if (params.user) filter.user = params.user
      if (typeof params.isActive !== 'undefined')
        filter.isActive = params.isActive

      return this.supportRequestModel.find(filter)
    } catch (error) {
      return error
    }
  }

  async markMessagesAsRead(
    supportRequest: string,
    role: IUserRole,
  ): Promise<IVoidOrNullOrError> {
    try {
      if (!isValidObjectId(supportRequest))
        return new Error(errorDictionary.invalidIdFormat())

      const supportRequestDocument = await this.supportRequestModel
        .findById(supportRequest)
        .populate({
          path: 'messages',
          select: ['_id', 'author', 'readAt'],
          match: { readAt: null },
          populate: {
            path: 'author',
            select: ['_id', 'role'],
            match: { role },
          },
        })

      if (!supportRequest) return null

      const messagesIds = supportRequestDocument.messages
        .filter((item) => item.author !== null)
        .map((item: IMessagePublic) => item._id.toString())

      await this.messageModel.updateMany(
        {
          _id: {
            $in: messagesIds,
          },
        },
        {
          readAt: Date.now(),
        },
      )
    } catch (error) {
      return error
    }
  }

  async getUnreadCount(
    supportRequest: string,
    role: { role: Condition<User['role']> },
  ): Promise<number | Error> {
    try {
      if (!isValidObjectId(supportRequest))
        return new Error(errorDictionary.invalidIdFormat())

      const supportRequestDocument = await this.supportRequestModel
        .findById(supportRequest)
        .populate({ path: 'messages', select: ['_id', 'author'] })

      if (!supportRequestDocument) return null

      const messages = await this.messageModel
        .find({
          _id: {
            $in: supportRequestDocument.messages.map((item: IMessagePublic) =>
              item._id.toString(),
            ),
          },
          readAt: null,
        })
        .populate({ path: 'author', match: role, select: ['_id', 'role'] })

      if (!messages.length) return 0

      return messages.filter((item) => item.author !== null).length
    } catch (error) {
      return error
    }
  }

  async sendMessage(
    data: IMessageSendDto,
  ): Promise<IMessagePublic | Error | null> {
    try {
      if (!isValidObjectId(data.supportRequest))
        return new Error(errorDictionary.invalidIdFormat('supportRequest'))
      if (!isValidObjectId(data.author))
        return new Error(errorDictionary.invalidIdFormat('author'))

      const supportRequest = await this.supportRequestModel.findById(
        data.supportRequest,
      )

      if (!supportRequest) return null

      const createdMessage = await this.messageModel.create({
        author: data.author,
        text: data.text,
      })

      supportRequest.messages.push(createdMessage)

      await supportRequest.save()

      new SendMessageEvent(supportRequest, createdMessage)

      return createdMessage
    } catch (error) {
      return error
    }
  }

  async getMessages(
    supportRequest: string,
  ): Promise<IMessagePublic[] | Error | null> {
    if (!isValidObjectId(supportRequest))
      return new Error(errorDictionary.invalidIdFormat())

    const supportRequestDocument = await this.supportRequestModel
      .findById(supportRequest)
      .populate('messages')

    if (!supportRequestDocument) return null

    return supportRequestDocument.messages as IMessagePublic[]
  }

  subscribe(
    handler: (
      supportRequest: ISupportRequestPublic,
      message: IMessagePublic,
    ) => void,
  ) {
    eventBus.on(SendMessageEvent.name, handler)
  }
}
