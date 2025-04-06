import sql from 'mssql'
import chalk from 'chalk'

import { USER, DATABASE, INSTANCENAME, PASSWORD, PORTDB, SERVER_NAME } from '../../config.js'

export const dbConfig = {
  user: USER,
  password: PASSWORD,
  server: SERVER_NAME,
  database: DATABASE,
  port: parseInt(PORTDB, 10),
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    instancename: INSTANCENAME
  }
}

export const getConnection = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig)

    return pool
  } catch (error) {
    console.log(chalk.red.bold('Erro interno: '), chalk.yellow(error.message))
  }
}

export const closeConnection = async (pool) => {
  try {
    await pool?.close()

    console.log('Conexão fechada com sucesso.')
  } catch (error) {
    console.log(chalk.red.bold('Erro interno: '), chalk.yellow(error.message))
  }
}
