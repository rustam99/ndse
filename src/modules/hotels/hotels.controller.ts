import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { HotelsService } from './hotels.service'
import { HotelsRoomService } from './hotelsRoom.service'
import { IHotelRoomCreateDto } from './interfaces'

@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelsRoomService: HotelsRoomService,
  ) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('images'))
  async test(
    @Body() body: IHotelRoomCreateDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const result = await this.hotelsRoomService.create({
      hotel: '658adc0ccdb8d3600a81f19c',
      description: 'Normal comfort room',
      images: files.map((file) => file.path),
    })

    return result
  }
}
