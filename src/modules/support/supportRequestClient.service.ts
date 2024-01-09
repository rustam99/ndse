import { Injectable } from '@nestjs/common'
import {
  ISupportRequestClientService,
  ISupportRequestPublic,
  ISupportRequestService,
} from './interfaces'
import {
  IMessageMarkAsReadDto,
  ISupportRequestCreateDto,
} from './interfaces/dto'
import { Error, isValidObjectId, Model } from 'mongoose'
import { errorDictionary } from '../../utils/errorDictionary'
import { InjectModel } from '@nestjs/mongoose'
import { SupportRequest } from './schemas/supportRequest.schema'
import { Message } from './schemas/message.schema'
import { usersRoles } from '../users/utils/usersRoles'
import { SupportRequestService } from './supportRequest.service'
import { SendMessageEvent } from './events/sendMessageEvent'

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private supportRequest: SupportRequestService,
  ) {}

  async createSupportRequest(
    data: ISupportRequestCreateDto,
  ): Promise<ISupportRequestPublic | Error> {
    try {
      if (!isValidObjectId(data.user))
        return new Error(errorDictionary.invalidIdFormat('user'))

      const createdMessage = await this.messageModel.create({
        author: data.user,
        text: data.text,
      })

      const createdSupportRequest = await this.supportRequestModel.create({
        user: data.user,
        messages: [createdMessage],
      })

      new SendMessageEvent(createdSupportRequest, createdMessage)

      return createdSupportRequest
    } catch (error) {
      return error
    }
  }

  async markMessagesAsRead(
    params: IMessageMarkAsReadDto,
  ): ReturnType<ISupportRequestService['markMessagesAsRead']> {
    return this.supportRequest.markMessagesAsRead(params, {
      author: { $ne: params.user },
    })
  }

  async getUnreadCount(
    supportRequest: string,
  ): ReturnType<ISupportRequestService['getUnreadCount']> {
    return this.supportRequest.getUnreadCount(supportRequest, {
      role: { $ne: usersRoles.client },
    })
  }
}
