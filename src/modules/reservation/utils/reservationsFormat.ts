import { IReservationPublic } from '../interfaces'

export const reservationsFormat = (reservations: IReservationPublic[]) =>
  reservations.map((item) => {
    return {
      id: item._id,
      dateStart: item.dateStart,
      dateEnd: item.dateEnd,
      hotelRoom: item.roomId,
      hotel: item.hotelId,
    }
  })
