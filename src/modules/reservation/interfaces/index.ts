import { IReservationCreateDto, IReservationCreateProps } from './dto'
import { IUser } from '../../users/interfaces'
import { IHotel, IHotelRoom } from '../../hotels/interfaces'
import { HydratedDocument } from 'mongoose'
import { Reservation } from '../schemas/reservation.schema'

export interface IReservation {
  userId: IUser
  hotelId: IHotel
  roomId: IHotelRoom
  dateStart: Date
  dateEnd: Date
}

export type IReservationDocument = HydratedDocument<Reservation>

export interface IReservationPublic extends IReservation {
  _id: IReservationDocument['id']
}

export interface IReservationSearchOptions {
  userId?: string
  roomId?: string
  dateStart?: Date
  dateEnd?: Date
}

export interface IReservationService {
  addReservation(
    reservation: IReservationCreateProps,
  ): Promise<IReservationPublic | Error | null>
  removeReservation(id: string): Promise<Error | void>
  getReservations(
    params: IReservationSearchOptions,
  ): Promise<IReservationPublic[] | Error>
}

export { IReservationCreateDto }
