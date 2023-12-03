import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IBook } from '../interfaces/Book'

@Schema()
export class Book implements IBook {
  @Prop({ required: true })
  name: string
  @Prop({ required: true })
  description: string
  @Prop([String])
  authors: string[]
}

export const BookSchema = SchemaFactory.createForClass(Book)
