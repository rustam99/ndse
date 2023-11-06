import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BooksModule } from './books/books.module'
import { config } from './config'

@Module({
  imports: [MongooseModule.forRoot(config.MONGO_URL), BooksModule],
})
export class AppModule {}
