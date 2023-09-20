import passport from 'passport'

export const signin = (request, response, next) => {
  passport.authenticate('local', {}, (error, user, info) => {
    if (error) {
      return response
        .status(500)
        .json({ status: 'error', error: error?.message })
    }

    if (info?.message) {
      return response.status(401).json({ status: 'error', error: info.message })
    }

    request.login(user, (error) => {
      if (error) {
        return response
          .status(500)
          .json({ status: 'error', error: error?.message })
      }

      const prevSession = request.session

      request.session.regenerate((error) => {
        if (error) {
          return response
            .status(500)
            .json({ status: 'error', error: error?.message })
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
