import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local-strategy'
import { AuthClientController } from './authClient.controller'
import { SessionSerializer } from './session/session.serializer'

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthClientController],
})
export class AuthModule {}
