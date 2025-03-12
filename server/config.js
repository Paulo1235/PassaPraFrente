import config from 'config'

const NAME = config.get('APP.NAME')
const PORT = config.get('APP.PORT')
const NODE_ENV = config.get('NODE_ENV')
const SALT_ROUNDS = config.get('SALT_ROUNDS')

export { NAME, PORT, NODE_ENV, SALT_ROUNDS }
