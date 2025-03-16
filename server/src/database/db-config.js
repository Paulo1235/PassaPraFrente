import sql from 'mssql'
import { StatusCodes } from 'http-status-codes'

import { USER, DATABASE, INSTANCENAME, PASSWORD, PORTDB, SERVER_NAME } from '../../config.js'
import { response } from '../utils/response.js'

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

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig)

    return pool
  } catch (error) {
    console.error('Internal error: ', error.message)
    response(response, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Error connecting to the database.')
  }
}
