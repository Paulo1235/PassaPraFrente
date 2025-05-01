import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class ConditionRepository {
  static async getConditionById (condition) {
    const pool = await getConnection()

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
}

export default ConditionRepository
