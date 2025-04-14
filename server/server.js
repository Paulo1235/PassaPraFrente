import chalk from 'chalk'
import app from './app.js'
import { PORT, NAME } from './config.js'

import { initSocketServer } from './src/utils/socket-server.js'
import { checkDatabaseConnection } from './src/database/connection.js'
import { closeConnection, getConnection } from './src/database/db-config.js'
import { configureCloudinary } from './src/services/cloudinary-service.js'

configureCloudinary()

const server = app.listen(PORT, async () => {
  console.log(
    chalk.green.bold(`\nApp '${NAME}' está a correr.`) + '\n' +
    chalk.blue.underline(`Ativo em: http://localhost:${PORT}`)
  )
  await checkDatabaseConnection()
})

initSocketServer(server)

const shutdown = async () => {
  const pool = await getConnection()

  await closeConnection(pool)

  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
