import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { UseGuards } from '@nestjs/common'
import { usersRoles } from './modules/users/utils/usersRoles'
import { WsAuthenticatedRoleGuardGuard } from './guards/ws.authenticatedRoleGuard.guard'
import { Socket, Server } from 'socket.io'
import { IUserPublic } from './modules/users/interfaces'
import { SupportRequestService } from './modules/support/supportRequest.service'
@WebSocketGateway({ cors: true, credentials: true })
export class AppGateway {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @WebSocketServer()
  server: Server
  @UseGuards(
    new WsAuthenticatedRoleGuardGuard([usersRoles.client, usersRoles.manager]),
  )
  @SubscribeMessage('subscribeToChat')
  handleMessage(
    @MessageBody('payload') payload: { chatId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    if (!payload?.chatId) {
      throw new WsException('chatId not found')
    }

    const user: IUserPublic = (socket.request as any)?.user

    this.supportRequestService.subscribe((supportRequest, message) => {
      if (supportRequest.user.toString() !== user._id)
        throw new WsException('permission denied')

      socket.emit('newMessage', {
        id: message._id,
        createdAt: message.sentAt,
        text: message.text,
        readAt: message?.readAt ?? null,
        author: message.author,
      })
    })
  }
}
