import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { AuthenticatedRoleGuard } from '../../guards/AuthenticatedRoleGuard.guard'
import { usersRoles } from '../users/utils/usersRoles'
import { IReservationCreateDto } from './interfaces'
import { HotelsRoomService } from '../hotels/hotelsRoom.service'
import { hotelsErrorDictionary } from '../hotels/utils/hotelsErrorDictionary'
import { IHotelPublic, IHotelRoomPublic } from '../hotels/interfaces'

@Controller('')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelsRoomService: HotelsRoomService,
  ) {}

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.client))
  @Post('client/reservations')
  async createReservation(
    @Request() request,
    @Body() body: IReservationCreateDto,
  ) {
    // @ts-expect-error hotel has id
    const room: (IHotelRoomPublic & { hotel: IHotelPublic }) | Error =
      await this.hotelsRoomService.findById(body.hotelRoom)

    if (room instanceof Error)
      throw new BadRequestException(room.message, room.name)
    if (!room) throw new NotFoundException()
    if (!room.isEnabled)
      throw new BadRequestException(hotelsErrorDictionary.hotelRoomNotEnabled)

    const createdReservation = await this.reservationService.addReservation({
      ...body,
      dateStart: body.startDate,
      dateEnd: body.endDate,
      userId: request.user._id,
      hotelId: room.hotel._id,
    })

    if (createdReservation instanceof Error) {
      throw new BadRequestException(
        createdReservation.message,
        createdReservation.name,
      )
    }

    return {
      startDate: createdReservation.dateStart,
      endDate: createdReservation.dateEnd,
      hotelRoom: createdReservation.roomId,
      hotel: createdReservation.hotelId,
    }
  }
}
