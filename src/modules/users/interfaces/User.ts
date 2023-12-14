export interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
  salt: string
}

export interface IUserPublic extends Omit<IUser, 'password' | 'salt'> {
  id: string
}
