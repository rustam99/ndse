import {
  Controller,
  Get,
  Query,
  Param,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { HotelsRoomService } from './hotelsRoom.service'
import { IHotelRoomSearchParams } from './interfaces'
import { usersRoles } from '../users/utils/usersRoles'

@Controller('common')
export class HotelsRoomController {
  constructor(private readonly hotelsRoomService: HotelsRoomService) {}

  @Get('hotel-rooms')
  async getRooms(
    @Request() request,
    @Query() params: Omit<IHotelRoomSearchParams, 'isEnabled'>,
  ) {
    let isEnabled: boolean | undefined = undefined

    if (!request.isAuthenticated() || request.user.role === usersRoles.client) {
      isEnabled = true
    }

    const rooms = await this.hotelsRoomService.search({ ...params, isEnabled })

    if (rooms instanceof Error) {
      throw new BadRequestException(rooms.message, rooms.name)
    }

    return rooms
  }

  @Get('hotel-rooms/:id')
  async getRoom(@Param('id') id: string) {
    const room = await this.hotelsRoomService.findById(id)

    if (room instanceof Error) {
      throw new BadRequestException(room.message, room.name)
    }

    if (!room) throw new NotFoundException()

    return room
  }
}
