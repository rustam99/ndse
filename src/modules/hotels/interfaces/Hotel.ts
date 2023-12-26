import { Hotel } from '../schemas/hotel.schema'
import { HydratedDocument } from 'mongoose'
import { IHotelCreateDto, IHotelUpdateDto } from './dto/Hotel.dto'

export interface IHotel {
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export type IHotelDocument = HydratedDocument<Hotel>

export interface IHotelPublic extends IHotel {
  _id: IHotelDocument['id']
}

export interface IHotelSearchParams {
  limit?: number
  offset?: number
  title?: IHotel['title']
  description?: IHotel['description']
}

export interface IHotelService {
  create(hotel: IHotelCreateDto): Promise<IHotelPublic | Error>
  update(
    id: string,
    hotel: IHotelUpdateDto,
  ): Promise<IHotelPublic | Error | null>
  findById(id: string): Promise<IHotelPublic | Error | null>
  search(params: IHotelSearchParams): Promise<IHotelPublic[]>
}
