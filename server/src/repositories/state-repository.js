import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class StateRepository {
  static async getStateById (state) {
    const pool = await getConnection()

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

export default StateRepository
