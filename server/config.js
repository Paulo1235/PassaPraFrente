import config from 'config'

const NODE_ENV = config.get('NODE_ENV')

const NAME = config.get('APP.NAME')
const PORT = config.get('APP.PORT')

const SALT_ROUNDS = config.get('SALT_ROUNDS')

const MAX = config.get('RATE_LIMIT.MAX')
const WINDOWMS = config.get('RATE_LIMIT.WINDOWMS')

export { NODE_ENV, NAME, PORT, SALT_ROUNDS, MAX, WINDOWMS }
