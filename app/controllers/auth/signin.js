import passport from 'passport'
import { responseErrors } from '../../utils/responseErrors.js'

export const signin = (request, response, next) => {
  passport.authenticate('local', {}, (error, user, info) => {
    if (error) {
      return responseErrors.internal(response, error?.message)
    }

    if (info?.message) {
      return responseErrors.unauthorized(response, info.message)
    }

    request.login(user, (error) => {
      if (error) {
        return responseErrors.internal(response, error?.message)
      }

      const prevSession = request.session

      request.session.regenerate((error) => {
        if (error) {
          return responseErrors.internal(response, error?.message)
        }

        Object.assign(request.session, prevSession)

        return response.json({
          status: 'ok',
          data: {
            id: user._id,
            email: user.email,
            name: user.email,
            contactPhone: user.contactPhone,
          },
        })
      })
    })
  })(request, response, next)
}
