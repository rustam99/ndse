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
