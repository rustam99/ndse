import { IReservationCreateDto } from './dto'
import { IUser } from '../../users/interfaces'
import { IHotel, IHotelRoom } from '../../hotels/interfaces'
import { IHotelDocument } from '../../hotels/interfaces/HotelRoom'

export interface IReservation {
  userId: IUser
  hotelId: IHotel
  roomId: IHotelRoom
  dateStart: Date
  dateEnd: Date
}

export interface IReservationPublic extends IReservation {
  _id: IHotelDocument['id']
}

export interface IReservationSearchOptions {
  userId?: string
  roomId?: string
  dateStart?: Date
  dateEnd?: Date
}

export interface IReservationService {
  addReservation(
    reservation: IReservationCreateDto,
  ): Promise<IReservationPublic | Error>
  removeReservation(id: string): Promise<Error | void>
  getReservations(
    params: IReservationSearchOptions,
  ): Promise<IReservationPublic[] | Error>
}

export { IReservationCreateDto }
