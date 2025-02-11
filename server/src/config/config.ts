import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

export default {
    // General
    ENV: process.env.ENV,
    PORT: process.env.PORT || 5000,
    SERVER_URL: process.env.SERVER_URL,
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,

    REFRESH_TOKEN: {
        EXPIRY: '7d',
        SECRET: process.env.REFRESH_TOKEN_SECRET || '',
    },
    ACCESS_TOKEN: {
        EXPIRY: '1h',
        SECRET: process.env.ACCESS_TOKEN_SECRET || '',
    },
}
