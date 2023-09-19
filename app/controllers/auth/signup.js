import { UserModule } from '../../services/auth/index.js'

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
      if (/duplicate key error/.test(error?.message)) {
        return response.status(400).json({
          error: 'email занят',
          status: 'error',
        })
      }

      return response.status(500).json({ status: 'error', error })
    })
}
