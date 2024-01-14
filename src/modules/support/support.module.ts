import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/supportRequest.schema'
import { Message, MessageSchema } from './schemas/message.schema'
import { SupportRequestService } from './supportRequest.service'
import { SupportRequestClientService } from './supportRequestClient.service'
import { SupportRequestEmployeeService } from './supportRequestEmployee.service'
import { SupportRoleController } from './supportRole.controller'
import { SupportController } from './support.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
  controllers: [SupportRoleController, SupportController],
  exports: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportModule {}
