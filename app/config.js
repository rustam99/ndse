export const config = {
    PORT: process.env.PORT ?? '3000',
    MONGO_URL: process.env.MONGO_URL,
    UPLOAD: process.env.UPLOAD ?? 'upload',
    SESSION_SECRET: process.env.SESSION_SECRET,
}

