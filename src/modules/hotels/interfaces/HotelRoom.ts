import { HydratedDocument } from 'mongoose'
import { IHotel, IHotelRoomCreateDto, IHotelRoomUpdateDto } from './index'
import { HotelRoom } from '../schemas/hotelRoom.schema'

export interface IHotelRoom {
  hotel: IHotel
  description: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  isEnabled: boolean
}

export type IHotelDocument = HydratedDocument<HotelRoom>

export interface IHotelRoomPublic extends IHotelRoom {
  _id: IHotelDocument['id']
}

export interface IHotelRoomSearchParams {
  limit?: number
  offset?: number
  hotel?: string
  description?: string
  isEnabled?: boolean
}

export interface IHotelRoomService {
  create(room: IHotelRoomCreateDto): Promise<IHotelRoomPublic | Error>
  update(
    id: string,
    room: IHotelRoomUpdateDto,
  ): Promise<IHotelRoomPublic | Error | null>
  findById(id: string): Promise<IHotelRoomPublic | Error | null>
  search(params: IHotelRoomSearchParams): Promise<IHotelRoomPublic[] | Error>
}
