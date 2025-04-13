import config from 'config'

export const NODE_ENV = config.get('NODE_ENV')

export const NAME = config.get('APP.NAME')
export const PORT = config.get('APP.PORT')

export const SALT_ROUNDS = config.get('SALT_ROUNDS')

export const MAX = config.get('RATE_LIMIT.MAX')
export const WINDOWMS = config.get('RATE_LIMIT.WINDOWMS')

export const USER = config.get('DATABASE.USER')
export const PASSWORD = config.get('DATABASE.PASSWORD')
export const SERVER_NAME = config.get('DATABASE.SERVER_NAME')
export const DATABASE = config.get('DATABASE.DATABASE')
export const PORTDB = config.get('DATABASE.PORTDB')
export const INSTANCENAME = config.get('DATABASE.INSTANCENAME')

export const ACCESS_TOKEN_SECRET_KEY = config.get('TOKEN.ACCESS_TOKEN_SECRET_KEY')
export const REFRESH_TOKEN_SECRET_KEY = config.get('TOKEN.REFRESH_TOKEN_SECRET_KEY')
export const ACCESS_TOKEN_EXPIRE = config.get('TOKEN.ACCESS_TOKEN_EXPIRE')
export const REFRESH_TOKEN_EXPIRE = config.get('TOKEN.REFRESH_TOKEN_EXPIRE')
export const ACTIVATION_CODE_EXPIRE = config.get('TOKEN.ACTIVATION_CODE_EXPIRE')

export const DIRNAME = import.meta.dirname

export const SMTP_HOST = config.get('EMAIL.SMTP_HOST')
export const SMTP_PORT = config.get('EMAIL.SMTP_PORT')
export const SMTP_SERVICE = config.get('EMAIL.SMTP_SERVICE')
export const SMTP_PASSWORD = config.get('EMAIL.SMTP_PASSWORD')
export const SMTP_MAIL = config.get('EMAIL.SMTP_MAIL')

export const CLOUDINARY_NAME = config.get('CLOUDINARY.NAME')
export const CLOUDINARY_API_KEY = config.get('CLOUDINARY.API_KEY')
export const CLOUDINARY_API_SECRET = config.get('CLOUDINARY.API_SECRET')

export const NOTIFICATION_EXPIRE_DAYS = config.get('NOTIFICATION.EXPIRE_DAYS')

export const FRONTEND_URL = config.get('FRONTEND.URL')
