import { eventBus } from '../utils/eventBus.js'

export class SendMessageEvent {
  static name = Symbol('sendMessageEvent')

  constructor(message) {
    this.message = message

    eventBus.emit(SendMessageEvent.name, this)
  }
}
