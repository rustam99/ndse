import { IUser } from '../../../users/interfaces/User'

export interface ISignUpDto extends Omit<IUser, 'salt'> {}
