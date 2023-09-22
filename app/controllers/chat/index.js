export class ChatController {
  constructor(socket) {
    this.socket = socket
  }

  async getHistory(id, socket) {
    console.log(id)
  }
  async sendMessage({ receiver, text }, socket) {
    console.log(receiver)
    console.log(text)
  }
}
