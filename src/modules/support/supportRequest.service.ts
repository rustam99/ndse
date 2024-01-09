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
import { IMessageMarkAsReadDto, IMessageSendDto } from './interfaces/dto'
import { IVoidOrNullOrError } from '../../types/utils'
import { User } from '../users/schemas/users.schema'

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
        filter.$and.push({ isActive: params.isActive })

      return this.supportRequestModel.find(filter)
    } catch (error) {
      return error
    }
  }

  async markMessagesAsRead(
    params: IMessageMarkAsReadDto,
    authorCondition: { author: Condition<Message['author']> },
  ): Promise<IVoidOrNullOrError> {
    try {
      if (!isValidObjectId(params.supportRequest))
        return new Error(errorDictionary.invalidIdFormat('supportRequest'))
      if (!isValidObjectId(params.user))
        return new Error(errorDictionary.invalidIdFormat('user'))

      const supportRequest = await this.supportRequestModel
        .findById(params.supportRequest)
        .populate('messages')

      if (!supportRequest) return null

      await this.messageModel.updateMany(
        {
          id: {
            $all: supportRequest.messages.map(
              (item: IMessagePublic) => item._id,
            ),
          },
          $and: [authorCondition],
        },
        { readAt: Date.now() },
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

      const unreadMessages = await this.messageModel
        .find({ id: supportRequest, readAt: null })
        .populate({
          path: 'author',
          match: { role },
        })

      // todo Проверить populate
      return unreadMessages.length
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
