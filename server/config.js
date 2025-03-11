import config from 'config'

const NAME = config.get('APP.NAME')
const PORT = config.get('APP.PORT')
const NODE_ENV = config.get('NODE_ENV')

export { NAME, PORT, NODE_ENV }
