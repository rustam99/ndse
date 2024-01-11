import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  IHotelRoomPublic,
  IHotelRoomSearchParams,
  IHotelRoomService,
  IHotelRoomCreateDto,
  IHotelRoomUpdateDto,
} from './interfaces'
import { InjectModel } from '@nestjs/mongoose'
import { HotelRoom } from './schemas/hotelRoom.schema'
import { FilterQuery, isValidObjectId, Model } from 'mongoose'
import { errorDictionary } from '../../utils/errorDictionary'

@Injectable()
export class HotelsRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoom>,
  ) {}

  async create(room: IHotelRoomCreateDto): Promise<IHotelRoomPublic | Error> {
    try {
      if (!isValidObjectId(room.hotelId)) {
        return new Error(errorDictionary.invalidIdFormat('hotel'))
      }

      const createdRoom = await this.hotelRoomModel.create({
        ...room,
        hotel: room.hotelId,
      })

      return this.hotelRoomModel
        .findById(createdRoom.id)
        .select('-createdAt -updatedAt')
        .populate({ path: 'hotel', select: ['id', 'title', 'description'] })
    } catch (error) {
      throw new InternalServerErrorException(error)
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

      const updatedHotelRoom = await this.hotelRoomModel
        .findByIdAndUpdate(id, room, {
          new: true,
        })
        .select('-createdAt -updatedAt')
        .populate({ path: 'hotel', select: ['id', 'title', 'description'] })

      if (!updatedHotelRoom) return null

      return updatedHotelRoom
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findById(id: string): Promise<IHotelRoomPublic | Error | null> {
    try {
      if (!isValidObjectId(id)) {
        return new Error(errorDictionary.invalidIdFormat())
      }

      const hotelRoom = await this.hotelRoomModel
        .findById(id)
        .select('-createdAt -updatedAt')
        .populate({ path: 'hotel', select: ['id', 'title', 'description'] })

      if (!hotelRoom) return null

      return hotelRoom
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async search(
    params: IHotelRoomSearchParams,
  ): Promise<IHotelRoomPublic[] | Error> {
    try {
      const filter: FilterQuery<HotelRoom> = {}

      if (typeof params.isEnabled !== 'undefined') {
        filter.isEnabled = params.isEnabled
      }

      if (params.hotel) {
        if (!isValidObjectId(params.hotel)) {
          return new Error(errorDictionary.invalidIdFormat('hotel'))
        }

        filter.hotel = params.hotel
      }

      if (!params.limit) {
        return this.hotelRoomModel
          .find(filter)
          .select('-createdAt -updatedAt -isEnabled')
          .populate({ path: 'hotel', select: ['id', 'title'] })
          .skip(params.offset ?? 0)
      }

      return this.hotelRoomModel
        .find(filter)
        .select('-createdAt -updatedAt -isEnabled')
        .populate({ path: 'hotel', select: ['id', 'title'] })
        .skip(params.offset ?? 0)
        .limit(params.limit)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
