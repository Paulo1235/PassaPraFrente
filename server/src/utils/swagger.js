import swaggerAutogen from 'swagger-autogen'

import { PORT } from '../../config.js'

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: `localhost:${PORT}/api`
}

const outputFile = '../../docs/swagger-output.json'
const routes = ['../routes/user-routes.js']

swaggerAutogen(outputFile, routes, doc)
