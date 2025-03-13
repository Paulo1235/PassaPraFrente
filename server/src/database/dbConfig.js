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
