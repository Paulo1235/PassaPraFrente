import sql from 'mssql'

import { dbConfig, getConnection } from '../database/db-config.js'

export class IdService {
  static async getConditionById (condition) {
    const pool = await getConnection(dbConfig)

    const conditionId = await pool
      .request()
      .input('condition', sql.VarChar, condition)
      .query(`
        SELECT Condicao_ID
        FROM Condicao
        WHERE Condicao = @condition
      `)

    return conditionId.recordset[0]?.Condicao_ID
  }

  static async getCategoryById (category) {
    const pool = await getConnection(dbConfig)

    const categoryId = await pool
      .request()
      .input('category', sql.VarChar, category)
      .query(`
        SELECT Categoria_ID
        FROM Categoria
        WHERE NomeCategoria = @category
      `)

    return categoryId.recordset[0]?.Categoria_ID
  }

  static async getStateById (state) {
    const pool = await getConnection(dbConfig)

    const stateId = await pool
      .request()
      .input('state', sql.VarChar, state)
      .query(`
        SELECT Estado_ID
        FROM Estado
        WHERE Estado = @state
      `)

    return stateId.recordset[0]?.Estado_ID
  }
}
