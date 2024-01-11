import {
  Controller,
  Post,
  Put,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { HotelsRoomService } from './hotelsRoom.service'
import { IHotelRoomCreateDto, IHotelRoomUpdateDto } from './interfaces'
import { usersRoles } from '../users/utils/usersRoles'
import { AuthenticatedRoleGuard } from '../../guards/AuthenticatedRoleGuard.guard'

@Controller('')
export class HotelsRoomRoleController {
  constructor(private readonly hotelsRoomService: HotelsRoomService) {}

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.admin))
  @Post('admin/hotel-rooms')
  @UseInterceptors(FilesInterceptor('images'))
  async addHotelRoom(
    @Body() body: IHotelRoomCreateDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const images: string[] = files.length ? files.map((file) => file.path) : []
    const createdRoom = await this.hotelsRoomService.create({ ...body, images })

    if (createdRoom instanceof Error) {
      throw new BadRequestException(createdRoom.message, createdRoom.name)
    }

    return createdRoom
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.admin))
  @Put('admin/hotel-rooms/:id')
  @UseInterceptors(FilesInterceptor('images'))
  async updateHotelRoom(
    @Body() body: IHotelRoomUpdateDto,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const images: string[] = []

    if (body.images) {
      if (Array.isArray(body.images)) {
        images.push(...body.images)
      } else {
        images.push(body.images)
      }
    }

    if (files.length) {
      images.push(...files.map((file) => file.path))
    }

    const updatedHotelRoom = await this.hotelsRoomService.update(id, {
      ...body,
      images,
    })

    if (updatedHotelRoom instanceof Error) {
      throw new BadRequestException(
        updatedHotelRoom.message,
        updatedHotelRoom.name,
      )
    }

    if (!updatedHotelRoom) throw new NotFoundException()

    return updatedHotelRoom
  }
}
