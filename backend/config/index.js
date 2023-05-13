import dotenv from 'dotenv'

dotenv.config();

export const {
    APP_PORT,
    SALT,
    JWT_SECRET,
    DEBUG_MODE,
    DB_URI
} = process.env