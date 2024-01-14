import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Get,
  Post,
  Delete,
  Request,
  UseGuards,
  Param,
  HttpCode,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { AuthenticatedRoleGuard } from '../../guards/AuthenticatedRoleGuard.guard'
import { usersRoles } from '../users/utils/usersRoles'
import { IReservationCreateDto } from './interfaces'
import { HotelsRoomService } from '../hotels/hotelsRoom.service'
import { hotelsErrorDictionary } from '../hotels/utils/hotelsErrorDictionary'
import { IHotelPublic, IHotelRoomPublic } from '../hotels/interfaces'
import { reservationsFormat } from './utils/reservationsFormat'

@Controller('client')
export class ReservationClientController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelsRoomService: HotelsRoomService,
  ) {}

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.client))
  @Get('reservations')
  async getReservations(@Request() request) {
    const reservations = await this.reservationService.getReservations({
      userId: request.user._id,
    })

    if (reservations instanceof Error) {
      throw new BadRequestException(reservations.message, reservations.name)
    }

    return reservationsFormat(reservations)
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.client))
  @Post('reservations')
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

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.client))
  @Delete('reservations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeReservation(@Param('id') id: string, @Request() request) {
    const reservation = await this.reservationService.getById(id)

    if (reservation instanceof Error) {
      throw new BadRequestException(reservation.message, reservation.name)
    }

    if (!reservation) throw new NotFoundException()

    if (request.user._id !== reservation.userId.toString()) {
      throw new ForbiddenException()
    }

    const removedReservation =
      await this.reservationService.removeReservation(id)

    if (removedReservation instanceof Error) {
      throw new BadRequestException(
        removedReservation.message,
        removedReservation.name,
      )
    }
  }
}
