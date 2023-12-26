import { IReservation } from './index'

export interface IReservationCreateDto
  extends Omit<IReservation, 'userId' | 'hotelId' | 'roomId'> {
  userId: string
  hotelId: string
  roomId: string
}
