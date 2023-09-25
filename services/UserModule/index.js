import { randomBytes, timingSafeEqual } from 'crypto'
import { hash } from '../../utils/hash.js'
import { userModel } from '../../models/user.js'

export const UserModule = {
  create: async ({ email, name, contactPhone, password }) => {
    try {
      if (!email) return new Error('Отсутствует обязательное поле - email')
      if (!name) return new Error('Отсутствует обязательное поле - name')
      if (!password)
        return new Error('Отсутствует обязательное поле - password')

      const passwordSalt = randomBytes(16)
      const hashedPassword = await hash(password, passwordSalt)

      const user = await userModel.create({
        email,
        name,
        contactPhone,
        passwordHash: hashedPassword.toString('hex'),
        passwordSalt: passwordSalt.toString('hex'),
      })

      const result = { id: user._id, name: user.name, email: user.email }

      if (contactPhone) result.contactPhone = contactPhone

      return result
    } catch (error) {
      if (/duplicate key error/.test(error?.message)) {
        return new Error('email занят')
      }

      throw error
    }
  },
  findByEmail: async (email) => {
    try {
      return userModel.findOne({ email }).exec()
    } catch (error) {
      return error
    }
  },
  verify: async (email, password, cb) => {
    try {
      const user = await UserModule.findByEmail(email)

      if (!user) {
        return cb(null, false, { message: 'Неверный логин или пароль' })
      }

      const hashedPassword = await hash(
        password,
        Buffer.from(user.passwordSalt, 'hex'),
      )

      if (
        !timingSafeEqual(Buffer.from(user.passwordHash, 'hex'), hashedPassword)
      ) {
        return cb(null, false, { message: 'Неверный логин или пароль' })
      }

      return cb(null, user)
    } catch (error) {
      return cb(error)
    }
  },
}
