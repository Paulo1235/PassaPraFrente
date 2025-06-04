process.loadEnvFile()

export const NODE_ENV = process.env.NODE_ENV

export const NAME = process.env.APP_NAME
export const PORT = process.env.APP_PORT

export const SALT_ROUNDS = process.env.SALT_ROUNDS

export const MAX = process.env.RATE_LIMIT_MAX
export const WINDOWMS = process.env.RATE_LIMIT_WINDOWMS

export const USER = process.env.DATABASE_USER
export const PASSWORD = process.env.DATABASE_PASSWORD
export const SERVER_NAME = process.env.DATABASE_SERVER_NAME
export const DATABASE = process.env.DATABASE_NAME
export const PORTDB = process.env.DATABASE_PORTDB
export const INSTANCENAME = process.env.DATABASE_INSTANCENAME

export const ACCESS_TOKEN_SECRET_KEY = process.env.TOKEN_ACCESS_TOKEN_SECRET_KEY
export const REFRESH_TOKEN_SECRET_KEY = process.env.TOKEN_REFRESH_TOKEN_SECRET_KEY
export const ACCESS_TOKEN_EXPIRE = process.env.TOKEN_ACCESS_TOKEN_EXPIRE
export const REFRESH_TOKEN_EXPIRE = process.env.TOKEN_REFRESH_TOKEN_EXPIRE
export const ACTIVATION_CODE_EXPIRE = process.env.TOKEN_ACTIVATION_CODE_EXPIRE

export const DIRNAME = import.meta.dirname

export const SMTP_HOST = process.env.EMAIL_SMTP_HOST
export const SMTP_PORT = process.env.EMAIL_SMTP_PORT
export const SMTP_SERVICE = process.env.EMAIL_SMTP_SERVICE
export const SMTP_PASSWORD = process.env.EMAIL_SMTP_MAIL
export const SMTP_MAIL = process.env.EMAIL_SMTP_PASSWORD

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
