export const config = {
  HTTP_PORT: process.env.HTTP_PORT ?? '3000',
  MONGO_URL: process.env.MONGO_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
}
