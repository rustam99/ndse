import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { IUserRole } from '../modules/users/interfaces'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class WsAuthenticatedRoleGuardGuard implements CanActivate {
  constructor(private readonly role: IUserRole | IUserRole[]) {}
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient()
    const isAuthenticated = client.request.isAuthenticated()

    if (!isAuthenticated) {
      throw new WsException('Unauthorized')
    }

    if (Array.isArray(this.role)) {
      return this.role.includes(client.user.role)
    }

    return client.request.user.role === this.role
  }
}
