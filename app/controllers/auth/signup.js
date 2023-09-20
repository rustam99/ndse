import { UserModule } from '../../services/UserModule/index.js'

export const signup = async (request, response) => {
  UserModule.create(request.body)
    .then((user) => {
      if (user instanceof Error) {
        return response.status(400).json({
          error: user.message,
          status: 'error',
        })
      }

      return response.json({
        status: 'ok',
        data: user,
      })
    })
    .catch((error) => {
      return response.status(500).json({ status: 'error', error })
    })
}
