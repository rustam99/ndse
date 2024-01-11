import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { IUserRole } from '../modules/users/interfaces'

@Injectable()
export class AuthenticatedRoleGuard implements CanActivate {
  constructor(private readonly role: IUserRole | IUserRole[]) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const isAuthenticated = request.isAuthenticated()

    if (!isAuthenticated) {
      throw new UnauthorizedException()
    }

    if (Array.isArray(this.role)) {
      return this.role.includes(request.user.role)
    }

    return request.user.role === this.role
  }
}
