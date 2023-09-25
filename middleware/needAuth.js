import { responseErrors } from '../utils/responseErrors.js'

export const needAuth = (request, response, next) => {
  if (!request.isAuthenticated()) {
    return responseErrors.unauthorized(response)
  }

  return next()
}
