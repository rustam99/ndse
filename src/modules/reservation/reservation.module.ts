import { Module } from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Reservation, ReservationSchema } from './schemas/reservation.schema'
import { ReservationController } from './reservation.controller'
import { HotelsModule } from '../hotels/hotels.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    HotelsModule,
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
