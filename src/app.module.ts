import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BooksModule } from './books/books.module'
import { config } from './config'
import { AsdService } from './asd/asd.service';

@Module({
  imports: [MongooseModule.forRoot(config.MONGO_URL), BooksModule],
  providers: [AsdService],
})
export class AppModule {}
