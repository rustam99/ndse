import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Reservation } from './schemas/reservation.schema'
import { FilterQuery, isValidObjectId, Model } from 'mongoose'
import {
  IReservationPublic,
  IReservationSearchOptions,
  IReservationService,
} from './interfaces'
import { errorDictionary } from '../../utils/errorDictionary'
import { reservationErrorDictionary } from './utils/reservationErrorDictionary'
import { IReservationCreateProps } from './interfaces/dto'

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
  ) {}

  async addReservation(
    reservation: IReservationCreateProps,
  ): Promise<IReservationPublic | Error | null> {
    try {
      if (!isValidObjectId(reservation.userId))
        return new Error(errorDictionary.invalidIdFormat('userId'))
      if (!isValidObjectId(reservation.hotelRoom))
        return new Error(errorDictionary.invalidIdFormat('roomId'))

      const isReservationExist = await this.reservationModel.findOne({
        roomId: reservation.hotelRoom,
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

      const createdReservation = await this.reservationModel.create({
        dateStart: reservation.dateStart,
        dateEnd: reservation.dateEnd,
        userId: reservation.userId,
        roomId: reservation.hotelRoom,
        hotelId: reservation.hotelId,
      })

      return this.reservationModel
        .findById(createdReservation.id)
        .populate({ path: 'hotelId', select: ['title', 'description'] })
        .populate({ path: 'roomId', select: ['description', 'images'] })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async removeReservation(id: string): Promise<Error | void> {
    try {
      if (!isValidObjectId(id))
        return new Error(errorDictionary.invalidIdFormat())

      await this.reservationModel.findByIdAndDelete(id)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getReservations(
    params: IReservationSearchOptions,
  ): Promise<IReservationPublic[] | Error> {
    try {
      const filter: FilterQuery<Reservation> = {}

      if (params.userId) {
        if (!isValidObjectId(params.userId)) {
          return new Error(errorDictionary.invalidIdFormat('userId'))
        }

        filter.userId = params.userId
      }

      if (params.roomId) {
        if (!isValidObjectId(params.roomId)) {
          return new Error(errorDictionary.invalidIdFormat('roomId'))
        }

        filter.roomId = params.roomId
      }

      if (params.dateStart) {
        filter.dateStart = params.dateStart
      }

      if (params.dateEnd) {
        filter.dateEnd = params.dateEnd
      }

      return this.reservationModel.find(filter)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
