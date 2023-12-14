import * as process from 'process'

export const config = {
  HTTP_PORT: process.env.HTTP_PORT ?? '3000',
  MONGO_URL: process.env.MONGO_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
}
