import { IUserRole } from '../interfaces'

type IUserRoleMap = {
  [K in IUserRole]: K
}

export const usersRoles: IUserRoleMap = {
  admin: 'admin',
  client: 'client',
  manager: 'manager',
}
