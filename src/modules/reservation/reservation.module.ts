import { Module } from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Reservation, ReservationSchema } from './schemas/reservation.schema'
import { ReservationClientController } from './reservationClient.controller'
import { HotelsModule } from '../hotels/hotels.module'
import { ReservationManagerController } from './reservationManager.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    HotelsModule,
  ],
  providers: [ReservationService],
  controllers: [ReservationClientController, ReservationManagerController],
  exports: [ReservationService],
})
export class ReservationModule {}
