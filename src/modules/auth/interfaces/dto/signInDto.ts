import { IUser } from '../../../users/interfaces/User'

export interface ISignInDto extends Omit<IUser, 'firstName'> {}
