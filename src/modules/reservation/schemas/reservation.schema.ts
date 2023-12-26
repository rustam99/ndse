import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IReservation } from '../interfaces'
import { User } from '../../users/schemas/users.schema'
import { Hotel } from '../../hotels/schemas/hotel.schema'
import { HotelRoom } from '../../hotels/schemas/hotelRoom.schema'
import { Schema as MongooseSchema } from 'mongoose'

@Schema()
export class Reservation implements IReservation {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: User
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Hotel' })
  hotelId: Hotel
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'HotelRoom',
  })
  roomId: HotelRoom
  @Prop({ required: true })
  dateStart: Date
  @Prop({ required: true })
  dateEnd: Date
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation)
