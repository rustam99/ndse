import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IHotelRoom } from '../interfaces'
import { Schema as MongooseSchema } from 'mongoose'
import { Hotel } from './hotel.schema'

@Schema()
export class HotelRoom implements IHotelRoom {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Hotel' })
  hotel: Hotel
  @Prop({ required: false })
  description: string
  @Prop({ required: false, default: [] })
  images: string[]
  @Prop({ required: true, default: Date.now() })
  createdAt: Date
  @Prop({ required: true, default: Date.now() })
  updatedAt: Date
  @Prop({ required: true, default: true })
  isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)
