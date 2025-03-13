import config from 'config'

const NODE_ENV = config.get('NODE_ENV')

const NAME = config.get('APP.NAME')
const PORT = config.get('APP.PORT')

const SALT_ROUNDS = config.get('SALT_ROUNDS')

const MAX = config.get('RATE_LIMIT.MAX')
const WINDOWMS = config.get('RATE_LIMIT.WINDOWMS')

const USER = config.get('DATABASE.USER')
const PASSWORD = config.get('DATABASE.PASSWORD')
const SERVER_NAME = config.get('DATABASE.SERVER_NAME')
const DATABASE = config.get('DATABASE.DATABASE')
const PORTDB = config.get('DATABASE.PORTDB')
const INSTANCENAME = config.get('DATABASE.INSTANCENAME')

export {
  NODE_ENV,
  NAME,
  PORT,
  SALT_ROUNDS,
  MAX,
  WINDOWMS,
  USER,
  PASSWORD,
  SERVER_NAME,
  DATABASE,
  PORTDB,
  INSTANCENAME
}
