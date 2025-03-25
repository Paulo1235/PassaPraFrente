import sql from 'mssql'

import { closeConnection, dbConfig, getConnection } from '../database/db-config'

export class IdService {
  static async getConditionById (name) {
    const pool = await getConnection(dbConfig)

    const condition = await pool
      .request()
      .input('name', sql.Int, name)
      .query(`
        SELECT Condicao_ID
        FROM Condicao
        WHERE NomeCategoria = @name
      `)

    await closeConnection(pool)

    return condition.recordset[0]
  }

  static async getCategoryById (name) {
    const pool = await getConnection(dbConfig)

    const category = await pool
      .request()
      .input('name', sql.Int, name)
      .query(`
        SELECT Categoria_ID
        FROM Categoria
        WHERE NomeCategoria = @name
      `)

    await closeConnection(pool)

    return category.recordset[0]
  }
}
