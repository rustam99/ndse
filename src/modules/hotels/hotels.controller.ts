import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  BadRequestException,
  Put,
  NotFoundException,
} from '@nestjs/common'
import {
  IHotelCreateDto,
  IHotelSearchParams,
  IHotelUpdateDto,
} from './interfaces'
import { usersRoles } from '../users/utils/usersRoles'
import { AuthenticatedRoleGuard } from '../../guards/AuthenticatedRoleGuard.guard'
import { HotelsService } from './hotels.service'

@Controller('')
export class HotelsController {
  constructor(private readonly hotelService: HotelsService) {}

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.admin))
  @Get('admin/hotels/')
  async getHotels(@Query() params: IHotelSearchParams) {
    return await this.hotelService.search(params)
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.admin))
  @Post('admin/hotels')
  async addHotel(@Body() body: IHotelCreateDto) {
    const createdHotel = await this.hotelService.create(body)

    if (createdHotel instanceof Error) {
      throw new BadRequestException(createdHotel.message, createdHotel.name)
    }

    return {
      id: createdHotel._id,
      title: createdHotel.title,
      description: createdHotel.description,
    }
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.admin))
  @Put('admin/hotels/:id')
  async updateHotel(@Param('id') id: string, @Body() body: IHotelUpdateDto) {
    const updatedHotel = await this.hotelService.update(id, body)

    if (updatedHotel instanceof Error) {
      throw new BadRequestException(updatedHotel.message, updatedHotel.name)
    }

    if (!updatedHotel) throw new NotFoundException()

    return {
      id: updatedHotel._id,
      title: updatedHotel.title,
      description: updatedHotel.description,
    }
  }
}
