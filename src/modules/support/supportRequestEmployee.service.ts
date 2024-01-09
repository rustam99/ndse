import { Injectable } from '@nestjs/common'
import {
  ISupportRequestEmployeeService,
  ISupportRequestService,
} from './interfaces'
import { IMessageMarkAsReadDto } from './interfaces/dto'
import { Error, isValidObjectId, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { SupportRequest } from './schemas/supportRequest.schema'
import { Message } from './schemas/message.schema'
import { SupportRequestService } from './supportRequest.service'
import { IVoidOrNullOrError } from '../../types/utils'
import { usersRoles } from '../users/utils/usersRoles'
import { errorDictionary } from '../../utils/errorDictionary'

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private supportRequest: SupportRequestService,
  ) {}

  async closeRequest(supportRequest: string): Promise<IVoidOrNullOrError> {
    if (!isValidObjectId(supportRequest))
      return new Error(errorDictionary.invalidIdFormat())

    const updatedSupportRequest =
      await this.supportRequestModel.findByIdAndUpdate(supportRequest, {
        isActive: false,
      })

    if (!updatedSupportRequest) return null
  }

  async markMessagesAsRead(
    params: IMessageMarkAsReadDto,
  ): ReturnType<ISupportRequestService['markMessagesAsRead']> {
    return this.supportRequest.markMessagesAsRead(params, {
      author: params.user,
    })
  }

  async getUnreadCount(
    supportRequest: string,
  ): ReturnType<ISupportRequestService['getUnreadCount']> {
    return this.supportRequest.getUnreadCount(supportRequest, {
      role: usersRoles.client,
    })
  }
}
