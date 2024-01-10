import { IUserCreateDto } from '../../users/interfaces'

export interface IAuthSignUpDto extends Omit<IUserCreateDto, 'role'> {}
