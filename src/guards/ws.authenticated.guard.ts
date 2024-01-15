import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient()
    const isAuthenticated = client.request.isAuthenticated()

    if (!isAuthenticated) {
      throw new WsException('Unauthorized')
    }

    return true
  }
}
