import chalk from 'chalk'
import sql from 'mssql'

import { dbConfig } from './db-config.js'

export const checkDatabaseConnection = async () => {
  try {
    await sql.connect(dbConfig).then((data) => {
      const server = dbConfig.server
      const database = dbConfig.database

      console.info(
        chalk.green.bold.underline('Base de dados conectada com sucesso') +
          ' | ' + chalk.yellow.bold('Servidor: ') +
          chalk.yellow.underline.bold(server) +
          ' | ' +
          chalk.blue.bold('Base de dados: ') +
          chalk.blue.underline.bold(database)
      )
    })
  } catch (error) {
    console.error(
      chalk.red.bold('Ocorreu um erro ao conectar à base de dados: ') +
        chalk.red.underline.bold(error.message)
    )

    setTimeout(checkDatabaseConnection, 5000)
  }
}
