import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HotelsService } from './hotels.service'
import { HotelsRoomService } from './hotelsRoom.service'
import { Hotel, HotelSchema } from './schemas/hotel.schema'
import { HotelRoom, HotelRoomSchema } from './schemas/hotelRoom.schema'
import { HotelsController } from './hotels.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { uploadFileName } from '../../utils/uploadFileName'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: 'upload/hotelRooms',
        filename(req, file, callback) {
          callback(null, uploadFileName(file))
        },
      }),
    }),
  ],
  providers: [HotelsService, HotelsRoomService],
  controllers: [HotelsController],
  exports: [HotelsService, HotelsRoomService],
})
export class HotelsModule {}
