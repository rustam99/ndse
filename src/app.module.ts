import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BooksModule } from './modules/books/books.module'
import { config } from './config'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO_URL),
    BooksModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
