import fs from 'node:fs'
import path from 'node:path'
import swaggerAutogen from 'swagger-autogen'

import { PORT, DIRNAME } from '../../config.js'

class SwaggerService {
  static generateDocs () {
    const doc = {
      info: {
        title: 'PassaPraFrente API',
        description: 'API para a gestão de vendas, empréstimos e sorteios numa comunidade de vizinhos.',
        version: '1.0.0',
        contact: {
          name: 'PassaPraFrente',
          email: 'passaprafrente@gmail.com'
        }
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      host: `localhost:${PORT}/api`
    }

    const routesDir = path.join(DIRNAME, 'src/routes')

    const routesFiles = fs
      .readdirSync(routesDir)
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(routesDir, file))

    const outputFile = path.join(DIRNAME, 'docs/swagger-output.json')

    swaggerAutogen(outputFile, routesFiles, doc)
  }
}

SwaggerService.generateDocs()

export default SwaggerService
