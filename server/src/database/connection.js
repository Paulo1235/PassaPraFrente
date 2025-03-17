import colors from 'colors'
import sql from 'mssql'

import { dbConfig } from './db-config.js'

colors.enable()

export const checkDatabaseConnection = async () => {
  try {
    await sql.connect(dbConfig).then((data) => {
      const server = dbConfig.server
      const database = dbConfig.database

      console.info(
        colors.underline(colors.bold(colors.green('Base de dados conectada com sucesso'))) +
          ' | ' + colors.bold(colors.yellow('Servidor: ')) +
          colors.underline(colors.bold(colors.yellow(`${server}`))) +
          ' | ' +
          colors.bold(colors.blue('Base de dados: ')) +
          colors.underline(colors.bold(colors.blue(`${database}`)))
      )
    })
  } catch (error) {
    console.error(
      colors.bold(colors.red('Ocorreu um erro ao conectar à base de dados: ')) +
        colors.underline(colors.bold(colors.red(`${error.message}`)))
    )

    setTimeout(checkDatabaseConnection, 5000)
  }
}
