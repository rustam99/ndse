import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IUser } from '../interfaces/User'

@Schema()
export class User implements IUser {
  @Prop({ required: true })
  firstName: string
  @Prop({ required: true })
  lastName: string
  @Prop({ required: true, unique: true })
  email: string
  @Prop({ required: true })
  password: string
  @Prop({ required: true })
  salt: string
}

export const UsersSchema = SchemaFactory.createForClass(User)
