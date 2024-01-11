import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  IHotelPublic,
  IHotelSearchParams,
  IHotelService,
  IHotelCreateDto,
  IHotelUpdateDto,
} from './interfaces'
import { InjectModel } from '@nestjs/mongoose'
import { Hotel } from './schemas/hotel.schema'
import { FilterQuery, isValidObjectId, Model } from 'mongoose'
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

      throw new InternalServerErrorException(error)
    }
  }

  async update(
    id: string,
    hotel: IHotelUpdateDto,
  ): Promise<IHotelPublic | Error | null> {
    try {
      console.log(id)
      console.log(hotel)

      if (!isValidObjectId(id)) {
        return new Error(errorDictionary.invalidIdFormat())
      }

      const updatedHotel = await this.hotelModel.findByIdAndUpdate(id, hotel, {
        new: true,
      })

      if (!updatedHotel) return null

      return updatedHotel
    } catch (error) {
      throw new InternalServerErrorException(error)
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
      throw new InternalServerErrorException(error)
    }
  }

  async search(params: IHotelSearchParams): Promise<IHotelPublic[]> {
    try {
      const filter: FilterQuery<Hotel> = {}

      if (params.title) {
        filter.title = regexStringFilter(params.title)
      }

      if (!params.limit) {
        return this.hotelModel
          .find(filter)
          .select(['id', 'title', 'description'])
          .skip(params.offset ?? 0)
      }

      return this.hotelModel
        .find(filter)
        .select(['id', 'title', 'description'])
        .skip(params.offset ?? 0)
        .limit(params.limit)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
