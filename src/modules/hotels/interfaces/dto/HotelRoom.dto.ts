import { IHotelRoom } from '../HotelRoom'

export interface IHotelRoomCreateDto
  extends Omit<
    IHotelRoom,
    'hotel' | 'createdAt' | 'updatedAt' | 'description' | 'images' | 'isEnabled'
  > {
  hotelId: string
  description?: IHotelRoom['description']
  images?: IHotelRoom['images']
}

export interface IHotelRoomUpdateDto
  extends Partial<Omit<IHotelRoom, 'createdAt' | 'updatedAt' | 'hotel'>> {}
