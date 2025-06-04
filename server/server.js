import chalk from 'chalk'
import app from './app.js'
import { PORT, NAME } from './config.js'

import { checkDatabaseConnection } from './src/database/connection.js'
import { closeConnection, getConnection } from './src/database/db-config.js'

app.listen(PORT, async () => {
  console.info(
    chalk.green.bold(`\nApp '${NAME}' está a correr.`) + '\n' +
    chalk.blue.underline('Servidor web a ser executado com sucesso.')
  )
  await checkDatabaseConnection()
})

const shutdown = async () => {
  const pool = await getConnection()

  await closeConnection(pool)

  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
