import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HotelsService } from './hotels.service'
import { HotelsRoomService } from './hotels.room.service'
import { Hotel, HotelSchema } from './schemas/hotel.schema'
import { HotelRoom, HotelRoomSchema } from './schemas/hotelRoom.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  providers: [HotelsService, HotelsRoomService],
  exports: [HotelsService, HotelsRoomService],
})
export class HotelsModule {}
