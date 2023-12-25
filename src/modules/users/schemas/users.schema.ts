import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IUser, IUserRole } from '../interfaces'

@Schema()
export class User implements IUser {
  @Prop({ required: true, unique: true })
  email: string
  @Prop({ required: true })
  passwordHash: string
  @Prop({ required: true })
  passwordSalt: string
  @Prop({ required: true })
  name: string
  @Prop({ required: false })
  contactPhone: string
  @Prop({ required: true, default: 'client' })
  role: IUserRole
}

export const UsersSchema = SchemaFactory.createForClass(User)
