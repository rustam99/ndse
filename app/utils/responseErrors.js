export const responseErrors = {
  badRequest: (response, error) => {
    response.status(400).json({ status: 'error', error })
  },
  unauthorized: (response, error = null) => {
    return response
      .status(401)
      .json({ status: 'error', error: error ?? 'Не авторизован' })
  },
  forbidden: (response, error = null) => {
    return response
      .status(403)
      .json({ status: 'error', error: error ?? 'У вас не хватает прав' })
  },
  notFound: (response, error = null) => {
    return response
      .status(404)
      .json({ status: 'error', error: error ?? 'Не найдено' })
  },
  internal: (response, error) => {
    return response.status(500).json({ status: 'error', error })
  },
}
