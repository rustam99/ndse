export const needAuth = (request, response, next) => {
  if (!request.isAuthenticated()) {
    return response
      .status(401)
      .json({ status: 'error', error: 'Не авторизован' })
  }

  return next()
}
