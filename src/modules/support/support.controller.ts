import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Request,
  BadRequestException,
  Param,
  ForbiddenException,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { SupportRequestClientService } from './supportRequestClient.service'
import { SupportRequestEmployeeService } from './supportRequestEmployee.service'
import { AuthenticatedRoleGuard } from '../../guards/AuthenticatedRoleGuard.guard'
import { usersRoles } from '../users/utils/usersRoles'
import { SupportRequestService } from './supportRequest.service'
import { IUserPublic } from '../users/interfaces'
import { IVoidOrNullOrError } from '../../types/utils'

@Controller('common')
export class SupportController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @UseGuards(
    new AuthenticatedRoleGuard([usersRoles.client, usersRoles.manager]),
  )
  @Get('support-requests/:id/messages')
  async getSupportRequestMessages(@Param('id') id: string, @Request() request) {
    const supportRequest = await this.getSupportRequest(id, request.user)

    return supportRequest.messages
  }

  @UseGuards(
    new AuthenticatedRoleGuard([usersRoles.client, usersRoles.manager]),
  )
  @Post('support-requests/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body('text') text: string,
    @Request() request,
  ) {
    await this.getSupportRequest(id, request.user)

    const sendMessage = await this.supportRequestService.sendMessage({
      supportRequest: id,
      author: request.user._id,
      text,
    })

    if (sendMessage instanceof Error) {
      throw new BadRequestException(sendMessage.message, sendMessage.name)
    }

    return sendMessage
  }

  @UseGuards(
    new AuthenticatedRoleGuard([usersRoles.client, usersRoles.manager]),
  )
  @Post('support-requests/:id/messages/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async readMessage(
    @Param('id') id: string,
    @Body('createdBefore') createdBefore: Date,
    @Request() request,
  ) {
    await this.getSupportRequest(id, request.user)

    let result: IVoidOrNullOrError = null

    if (request.user.role === usersRoles.client) {
      result = await this.supportRequestClientService.markMessagesAsRead({
        supportRequest: id,
        createdBefore,
      })
    } else if (request.user.role === usersRoles.manager) {
      result = await this.supportRequestEmployeeService.markMessagesAsRead({
        supportRequest: id,
        createdBefore,
      })
    }

    if (result instanceof Error) {
      throw new BadRequestException(result.message, result.name)
    }

    if (result === null) throw new NotFoundException()
  }

  private async getSupportRequest(id: string, user: IUserPublic) {
    const supportRequest = await this.supportRequestService.findById(id)

    if (supportRequest instanceof Error) {
      throw new BadRequestException(supportRequest.message, supportRequest.name)
    }

    if (
      user.role === usersRoles.client &&
      user._id !== supportRequest.user.toString()
    ) {
      throw new ForbiddenException()
    }

    return supportRequest
  }
}
