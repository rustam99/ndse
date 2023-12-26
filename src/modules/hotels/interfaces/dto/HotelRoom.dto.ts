import { IHotelRoom } from '../HotelRoom'

export interface IHotelRoomCreateDto
  extends Omit<
    IHotelRoom,
    'hotel' | 'createdAt' | 'updatedAt' | 'description' | 'images' | 'isEnabled'
  > {
  hotel: string
  description?: IHotelRoom['description']
  images?: IHotelRoom['images']
  isEnabled?: IHotelRoom['isEnabled']
}

export interface IHotelRoomUpdateDto
  extends Partial<Omit<IHotelRoom, 'createdAt' | 'updatedAt' | 'hotel'>> {}
