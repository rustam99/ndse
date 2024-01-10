import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { IUserPublic } from '../../users/interfaces'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: IUserPublic,
    done: (err: Error, user: IUserPublic) => void,
  ): any {
    done(null, user)
  }
  deserializeUser(
    payload: IUserPublic,
    done: (err: Error, payload: IUserPublic) => void,
  ): any {
    done(null, payload)
  }
}
