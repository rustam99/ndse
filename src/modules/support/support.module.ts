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
  exports: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportModule {}
