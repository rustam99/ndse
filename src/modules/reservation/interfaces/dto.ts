import { IReservation } from './index'

export interface IReservationCreateDto
  extends Omit<
    IReservation,
    'userId' | 'hotelId' | 'roomId' | 'dateStart' | 'dateEnd'
  > {
  hotelRoom: string
  startDate: string
  endDate: string
}

export interface IReservationCreateProps
  extends Omit<IReservationCreateDto, 'startDate' | 'endDate'> {
  hotelId: string
  userId: string
  dateStart: string
  dateEnd: string
}
