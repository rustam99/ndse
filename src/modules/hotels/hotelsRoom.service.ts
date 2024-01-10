import { Injectable } from '@nestjs/common'
import {
  IHotelRoomPublic,
  IHotelRoomSearchParams,
  IHotelRoomService,
} from './interfaces/HotelRoom'
import { InjectModel } from '@nestjs/mongoose'
import { HotelRoom } from './schemas/hotelRoom.schema'
import { FilterQuery, isValidObjectId, Model } from 'mongoose'
import { IHotelRoomCreateDto, IHotelRoomUpdateDto } from './interfaces'
import { errorDictionary } from '../../utils/errorDictionary'
import { regexStringFilter } from '../../utils/regexFilter'

@Injectable()
export class HotelsRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoom>,
  ) {}

  async create(room: IHotelRoomCreateDto): Promise<IHotelRoomPublic | Error> {
    try {
      if (!isValidObjectId(room.hotel)) {
        return new Error(errorDictionary.invalidIdFormat('hotel'))
      }

      return await this.hotelRoomModel.create(room)
    } catch (error) {
      return error
    }
  }

  async update(
    id: string,
    room: IHotelRoomUpdateDto,
  ): Promise<IHotelRoomPublic | Error | null> {
    try {
      if (!isValidObjectId(id)) {
        return new Error(errorDictionary.invalidIdFormat())
      }

      const updatedHotelRoom = await this.hotelRoomModel.findByIdAndUpdate(
        id,
        room,
        {
          new: true,
        },
      )

      if (!updatedHotelRoom) return null

      return updatedHotelRoom
    } catch (error) {
      return error
    }
  }

  async findById(id: string): Promise<IHotelRoomPublic | Error | null> {
    try {
      if (!isValidObjectId(id)) {
        return new Error(errorDictionary.invalidIdFormat())
      }

      const hotelRoom = await this.hotelRoomModel.findById(id)

      if (!hotelRoom) return null

      return hotelRoom
    } catch (error) {
      return error
    }
  }

  async search(
    params: IHotelRoomSearchParams,
  ): Promise<IHotelRoomPublic[] | Error> {
    const filter: FilterQuery<HotelRoom> = {
      $or: [],
    }

    if (typeof params.isEnabled !== 'undefined') {
      filter.$and = [{ isEnabled: params.isEnabled }]
    }

    if (params.hotel) {
      if (!isValidObjectId(params.hotel)) {
        return new Error(errorDictionary.invalidIdFormat('hotel'))
      }

      filter.$or.push({ hotel: params.hotel })
    }

    if (params.description) {
      filter.$or.push({ description: regexStringFilter(filter.description) })
    }

    if (!params.limit) {
      return this.hotelRoomModel.find(filter).skip(params.offset ?? 0)
    }

    return this.hotelRoomModel
      .find(filter)
      .skip(params.offset ?? 0)
      .limit(params.limit)
  }
}
