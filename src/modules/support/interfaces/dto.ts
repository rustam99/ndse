export interface ISupportRequestCreateDto {
  user: string
  text: string
}

export interface IMessageSendDto {
  author: string
  supportRequest: string
  text: string
}

export interface IMessageMarkAsReadDto {
  user: string
  supportRequest: string
  createdBefore: Date
}

export interface IMessageUpdateDto {
  text: string
  readAt: Date
}
