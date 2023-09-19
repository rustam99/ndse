import { pbkdf2 } from 'crypto'

export const hash = (string, salt) => {
  return new Promise((resolve, reject) => {
    return pbkdf2(string, salt, 310000, 32, 'sha256', (err, hash) => {
      if (err) return reject(err)

      return resolve(hash)
    })
  })
}
