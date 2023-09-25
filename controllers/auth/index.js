import passport from 'passport'
import { responseErrors } from '../../utils/responseErrors.js'
import { UserModule } from '../../services/UserModule/index.js'

export const AuthController = {
  signup: async (request, response) => {
    try {
      const user = await UserModule.create(request.body)

      if (user instanceof Error) {
        return responseErrors.badRequest(response, user.message)
      }

      return response.json({
        status: 'ok',
        data: user,
      })
    } catch (error) {
      return responseErrors.internal(response, error)
    }
  },
  signin: (request, response, next) => {
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
              name: user.name,
              contactPhone: user.contactPhone,
            },
          })
        })
      })
    })(request, response, next)
  },
}
