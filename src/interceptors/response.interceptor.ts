import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { Observable, map, catchError, throwError } from 'rxjs'

export interface Response<T> {
  data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({ status: 'success', data })),
      catchError((err) => {
        const wrapError = { status: 'fail', data: err?.response }

        if (err?.status === HttpStatus.BAD_REQUEST) {
          return throwError(() => new BadRequestException(wrapError))
        } else if (err?.status === HttpStatus.UNAUTHORIZED) {
          return throwError(() => new UnauthorizedException(wrapError))
        } else if (err?.status === HttpStatus.FORBIDDEN) {
          return throwError(() => new ForbiddenException(wrapError))
        } else if (err?.status === HttpStatus.NOT_FOUND) {
          return throwError(() => new NotFoundException(wrapError))
        }

        return throwError(() => new InternalServerErrorException(wrapError))
      }),
    )
  }
}
