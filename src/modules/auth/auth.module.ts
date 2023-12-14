import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { LocalStrategy } from './strategies/local-strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { config } from '../../config'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
