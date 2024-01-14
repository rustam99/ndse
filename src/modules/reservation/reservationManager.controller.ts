import {
  BadRequestException,
  Controller,
  NotFoundException,
  Get,
  Delete,
  UseGuards,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { AuthenticatedRoleGuard } from '../../guards/AuthenticatedRoleGuard.guard'
import { usersRoles } from '../users/utils/usersRoles'
import { reservationsFormat } from './utils/reservationsFormat'

@Controller('manager')
export class ReservationManagerController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.manager))
  @Get('reservations/:userId')
  async getReservations(@Param('userId') userId: string) {
    const reservations = await this.reservationService.getReservations({
      userId,
    })

    if (reservations instanceof Error) {
      throw new BadRequestException(reservations.message, reservations.name)
    }

    return reservationsFormat(reservations)
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.manager))
  @Delete('reservations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeReservation(@Param('id') id: string) {
    const removedReservation =
      await this.reservationService.removeReservation(id)

    if (removedReservation instanceof Error) {
      throw new BadRequestException(
        removedReservation.message,
        removedReservation.name,
      )
    }

    if (removedReservation === null) throw new NotFoundException()
  }
}
