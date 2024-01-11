import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local-strategy'
import { AuthRoleController } from './authRole.controller'
import { SessionSerializer } from './session/session.serializer'
import { AuthController } from './auth.contoller'

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController, AuthRoleController],
})
export class AuthModule {}
