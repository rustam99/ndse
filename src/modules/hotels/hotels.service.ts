import { Injectable } from '@nestjs/common'
import {
  IHotelPublic,
  IHotelSearchParams,
  IHotelService,
} from './interfaces/Hotel'
import { InjectModel } from '@nestjs/mongoose'
import { Hotel } from './schemas/hotel.schema'
import { isValidObjectId, Model } from 'mongoose'
import { IHotelCreateDto, IHotelUpdateDto } from './interfaces'
import { hotelsErrorDictionary } from './utils/hotelsErrorDictionary'
import { errorDictionary } from '../../utils/errorDictionary'
import { regexStringFilter } from '../../utils/regexFilter'

@Injectable()
export class HotelsService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private hotelModel: Model<Hotel>) {}

  async create(hotel: IHotelCreateDto): Promise<IHotelPublic | Error> {
    try {
      return await this.hotelModel.create(hotel)
    } catch (error) {
      if (/duplicate key error/.test(error?.message)) {
        return new Error(hotelsErrorDictionary.hotelNameIsBusy)
      }

      return error
    }
  }

  async update(
    id: string,
    hotel: IHotelUpdateDto,
  ): Promise<IHotelPublic | Error | null> {
    try {
      if (!isValidObjectId(id)) {
        return new Error(errorDictionary.invalidIdFormat())
      }

      const updatedHotel = await this.hotelModel.findByIdAndUpdate(id, hotel, {
        new: true,
      })

      if (!updatedHotel) return null

      return updatedHotel
    } catch (error) {
      return error
    }
  }

  async findById(id: string): Promise<IHotelPublic | Error | null> {
    try {
      if (!isValidObjectId(id)) {
        return new Error(errorDictionary.invalidIdFormat())
      }

      const hotel = await this.hotelModel.findById(id)

      if (!hotel) return null

      return hotel
    } catch (error) {
      return error
    }
  }

  async search(params: IHotelSearchParams): Promise<IHotelPublic[]> {
    const filter = []

    if (params.title) {
      filter.push({ title: regexStringFilter(params.title) })
    }

    if (params.description) {
      filter.push({
        description: regexStringFilter(params.description),
      })
    }

    if (!params.limit) {
      return this.hotelModel
        .find({
          $or: filter,
        })
        .skip(params.offset ?? 0)
    }

    return this.hotelModel
      .find({
        $or: filter,
      })
      .skip(params.offset ?? 0)
      .limit(params.limit)
  }
}
