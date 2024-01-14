import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common'
import { SupportRequestClientService } from './supportRequestClient.service'
import { SupportRequestEmployeeService } from './supportRequestEmployee.service'
import { AuthenticatedRoleGuard } from '../../guards/AuthenticatedRoleGuard.guard'
import { usersRoles } from '../users/utils/usersRoles'
import { ISupportRequestQueryParams } from './interfaces/dto'
import { SupportRequestService } from './supportRequest.service'
import { supportRequestFormat } from './utils/supportRequestFormat'

@Controller('')
export class SupportRoleController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.client))
  @Post('client/support-requests')
  async addSupportRequest(@Body('text') text: string, @Request() request) {
    const createdSupportRequest =
      await this.supportRequestClientService.createSupportRequest({
        text,
        user: request.user._id,
      })

    if (createdSupportRequest instanceof Error) {
      throw new BadRequestException(
        createdSupportRequest.message,
        createdSupportRequest.name,
      )
    }

    return {
      id: createdSupportRequest._id,
      createdAt: createdSupportRequest.createdAt,
      isActive: createdSupportRequest.isActive,
      hasNewMessages: false,
    }
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.client))
  @Get('client/support-requests')
  async getSupportClientRequest(
    @Query() params: ISupportRequestQueryParams,
    @Request() request,
  ) {
    const supportRequests =
      await this.supportRequestService.findSupportRequests({
        ...params,
        user: request.user._id,
      })

    if (supportRequests instanceof Error) {
      throw new BadRequestException(
        supportRequests.message,
        supportRequests.name,
      )
    }

    return await Promise.all(
      supportRequests.map(async (request) => {
        const unreadCount =
          await this.supportRequestClientService.getUnreadCount(request._id)
        const hasNewMessages =
          typeof unreadCount === 'number' ? unreadCount > 0 : false

        return supportRequestFormat(request, hasNewMessages)
      }),
    )
  }

  @UseGuards(new AuthenticatedRoleGuard(usersRoles.manager))
  @Get('manager/support-requests')
  async getSupportManagerRequest(@Query() params: ISupportRequestQueryParams) {
    const supportRequests =
      await this.supportRequestService.findSupportRequests({
        ...params,
      })

    if (supportRequests instanceof Error) {
      throw new BadRequestException(
        supportRequests.message,
        supportRequests.name,
      )
    }

    return await Promise.all(
      supportRequests.map(async (request) => {
        const unreadCount =
          await this.supportRequestEmployeeService.getUnreadCount(request._id)
        const hasNewMessages =
          typeof unreadCount === 'number' ? unreadCount > 0 : false

        return supportRequestFormat(request, hasNewMessages, true)
      }),
    )
  }
}
