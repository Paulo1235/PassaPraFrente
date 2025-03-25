import sql from 'mssql'

import { closeConnection, dbConfig, getConnection } from '../database/db-config'
import { IdService } from '../services/id-service'

export class ItemRepository {
  static async createItem ({ condition, category }) {
    const pool = await getConnection(dbConfig)

    const condicaoId = await IdService.getConditionById(condition.Condicao)

    const categoriaId = await IdService.getCategoryById(category.NomeCategoria)

    const item = await pool
      .request()
      .input('categoriaId', sql.Int, categoriaId)
      .input('condicaoId', sql.Int, condicaoId)
      .query(`
        INSERT INTO Item (Categoria_ID, Condicao_ID) VALUES (@categoriaId, @condicaoId)
      `)

    return item.recordset[0]
  }

  static async getAllItems () {
    const pool = await getConnection(dbConfig)

    const items = await pool
      .request()
      .query(`
        SELECT * 
        FROM Artigo
      `)

    await closeConnection(pool)

    return items.recordset
  }

  static async getItemById (id) {
    const pool = await getConnection(dbConfig)

    const item = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT * 
        FROM Artigo
        WHERE Artigo.
      `)

    await closeConnection(pool)

    return item.recordset[0]
  }

  static updateItem (data) {

  }
}
