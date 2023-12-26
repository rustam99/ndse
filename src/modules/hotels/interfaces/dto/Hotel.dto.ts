import { IHotel } from '../Hotel'

export interface IHotelUpdateDto
  extends Partial<Omit<IHotel, 'createdAt' | 'updatedAt'>> {}

export interface IHotelCreateDto
  extends Omit<IHotel, 'createdAt' | 'updatedAt'> {}
