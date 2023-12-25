import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './modules/users/users.module'
import { Config } from './config'

@Module({
  imports: [MongooseModule.forRoot(Config.MONGO_URL), UsersModule],
})
export class AppModule {}
