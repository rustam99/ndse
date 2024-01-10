import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './modules/users/users.module'
import { HotelsModule } from './modules/hotels/hotels.module'
import { ReservationModule } from './modules/reservation/reservation.module'
import { SupportModule } from './modules/support/support.module'
import { AuthModule } from './modules/auth/auth.module'
import { Config } from './config'

@Module({
  imports: [
    MongooseModule.forRoot(Config.MONGO_URL),
    UsersModule,
    HotelsModule,
    ReservationModule,
    SupportModule,
    AuthModule,
  ],
})
export class AppModule {}
