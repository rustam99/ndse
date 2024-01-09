import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import { IMessage } from '../interfaces'
import { User } from '../../users/schemas/users.schema'

@Schema()
export class Message implements IMessage {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: User
  @Prop({ required: true, default: Date.now() })
  sentAt: Date
  @Prop({ required: true })
  text: string
  @Prop({ required: false })
  readAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)
