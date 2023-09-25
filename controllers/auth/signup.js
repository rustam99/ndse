import { UserModule } from '../../services/UserModule/index.js'
import { responseErrors } from '../../utils/responseErrors.js'

export const signup = async (request, response) => {
  UserModule.create(request.body)
    .then((user) => {
      if (user instanceof Error) {
        return responseErrors.badRequest(response, user.message)
      }

      return response.json({
        status: 'ok',
        data: user,
      })
    })
    .catch((error) => {
      return responseErrors.internal(response, error)
    })
}
