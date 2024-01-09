import { eventBus } from '../../../utils/eventBus'
import { IMessagePublic, ISupportRequestPublic } from '../interfaces'

export class SendMessageEvent {
  private supportRequest: ISupportRequestPublic
  private message: IMessagePublic
  static eventName = Symbol('sendMessageEvent')

  constructor(supportRequest: ISupportRequestPublic, message: IMessagePublic) {
    this.supportRequest = supportRequest
    this.message = message

    eventBus.emit(SendMessageEvent.eventName, this)
  }
}
