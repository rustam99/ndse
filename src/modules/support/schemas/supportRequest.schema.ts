import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import { ISupportRequest } from '../interfaces'
import { User } from '../../users/schemas/users.schema'
import { Message } from './message.schema'

@Schema()
export class SupportRequest implements ISupportRequest {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User
  @Prop({ required: true, default: Date.now() })
  createdAt: Date
  @Prop({
    required: false,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }],
  })
  messages: Message[]
  @Prop({ required: false, default: true })
  isActive: boolean
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest)
