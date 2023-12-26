import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IHotel } from '../interfaces'

@Schema()
export class Hotel implements IHotel {
  @Prop({ required: true, unique: true })
  title: string
  @Prop({ required: false })
  description: string
  @Prop({ required: true, default: Date.now() })
  createdAt: Date
  @Prop({ required: true, default: Date.now() })
  updatedAt: Date
}

export const HotelSchema = SchemaFactory.createForClass(Hotel)
