export const config = {
    PORT: process.env.PORT ?? '3001',
    REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',
}
