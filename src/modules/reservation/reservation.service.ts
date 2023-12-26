import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Reservation } from './schemas/reservation.schema'
import { Error, FilterQuery, isValidObjectId, Model } from 'mongoose'
import {
  IReservationCreateDto,
  IReservationPublic,
  IReservationSearchOptions,
  IReservationService,
} from './interfaces'
import { errorDictionary } from '../../utils/errorDictionary'
import { reservationErrorDictionary } from './utils/reservationErrorDictionary'

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
  ) {}

  async addReservation(
    reservation: IReservationCreateDto,
  ): Promise<IReservationPublic | Error> {
    try {
      if (!isValidObjectId(reservation.userId))
        return new Error(errorDictionary.invalidIdFormat('userId'))
      if (!isValidObjectId(reservation.hotelId))
        return new Error(errorDictionary.invalidIdFormat('hotelId'))
      if (!isValidObjectId(reservation.roomId))
        return new Error(errorDictionary.invalidIdFormat('roomId'))

      const isReservationExist = await this.reservationModel.findOne({
        roomId: reservation.roomId,
        $or: [
          {
            $and: [
              { dateStart: { $lte: reservation.dateStart } },
              { dateEnd: { $gte: reservation.dateStart } },
            ],
          },
          {
            $and: [
              { dateStart: { $lte: reservation.dateEnd } },
              { dateEnd: { $gte: reservation.dateEnd } },
            ],
          },
        ],
      })

      if (isReservationExist) {
        return new Error(reservationErrorDictionary.roomIsBusy)
      }

      return await this.reservationModel.create(reservation)
    } catch (error) {
      return error
    }
  }

  async removeReservation(id: string): Promise<Error | void> {
    try {
      if (!isValidObjectId(id))
        return new Error(errorDictionary.invalidIdFormat())

      await this.reservationModel.findByIdAndDelete(id)
    } catch (error) {
      return error
    }
  }

  async getReservations(
    params: IReservationSearchOptions,
  ): Promise<IReservationPublic[] | Error> {
    const filter: FilterQuery<Reservation> = {
      $or: [],
    }

    if (params.userId) {
      if (!isValidObjectId(params.userId)) {
        return new Error(errorDictionary.invalidIdFormat('userId'))
      }

      filter.$or.push({ userId: params.userId })
    }

    if (params.roomId) {
      if (!isValidObjectId(params.roomId)) {
        return new Error(errorDictionary.invalidIdFormat('roomId'))
      }

      filter.$or.push({ roomId: params.roomId })
    }

    if (params.dateStart) {
      filter.$or.push({ dateStart: params.dateStart })
    }

    if (params.dateEnd) {
      filter.$or.push({ dateEnd: params.dateEnd })
    }

    return this.reservationModel.find(filter)
  }
}
