import passport from 'passport'
import passportLocal from 'passport-local'
import { UserModule } from '../services/UserModule/index.js'
import { AuthController } from '../controllers/auth/index.js'

const LocalStrategy = passportLocal.Strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    UserModule.verify,
  ),
)

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, {
      id: user.id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    })
  })
})

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user)
  })
})

export const authRoutes = (app) => {
  app.post('/api/signup', AuthController.signup)
  app.post('/api/signin', AuthController.signin)
}
