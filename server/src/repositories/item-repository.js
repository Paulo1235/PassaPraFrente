import sql from 'mssql'

import { closeConnection, dbConfig, getConnection } from '../database/db-config.js'
import IdService from '../services/id-service.js'

class ItemRepository {
  static async createItem (condition, category) {
    const pool = await getConnection(dbConfig)

    const condicaoId = await IdService.getConditionById(condition)

    const categoriaId = await IdService.getCategoryById(category)

    const item = await pool
      .request()
      .input('categoriaId', sql.Int, categoriaId)
      .input('condicaoId', sql.Int, condicaoId)
      .query(`
        INSERT INTO Artigo (Categoria_ID, Condicao_ID)
        OUTPUT Inserted.Artigo_ID
        VALUES (@categoriaId, @condicaoId)
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
        WHERE Artigo = @id
      `)

    await closeConnection(pool)

    return item.recordset[0]
  }

  static async updateItem ({ condition, category, id }) {
    const pool = await getConnection(dbConfig)

    const condicaoId = await IdService.getConditionById(condition.Condicao)

    const categoriaId = await IdService.getCategoryById(category.NomeCategoria)

    const updateItem = await pool
      .request()
      .input('id', sql.Int, id)
      .input('categoriaId', sql.Int, categoriaId)
      .input('condicaoId', sql.Int, condicaoId)
      .query(`
        UPDATE Artigo
        SET 
            Categoria_ID = @categoriaId,
            Condicao_ID = @condicaoId,
        WHERE Artigo_ID = @id; 
      `)
    await closeConnection(pool)

    return updateItem.recordset
  }

  static async uploadItemPhoto (id, publicId, url) {
    const pool = await getConnection()
    const item = await pool
      .request()
      .input('id', sql.Int, id).input('publicId', sql.VarChar, publicId)
      .input('url', sql.VarChar, url)
      .query(`
        INSERT INTO Imagem (URL, Artigo_ID)
        VALUES (@url,@publicId, @id)
    `)

    await closeConnection(pool)

    return item.rowsAffected[0] > 0
  }

  static async getItemPhoto (id) {
    const pool = await getConnection()

    const avatar = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT PublicID, Url
        FROM Imagem
        WHERE Artigo_ID = @id
      `)

    await closeConnection(pool)

    return avatar.recordset
  }

  static async updateItemPhoto (id, publicId, url) {
    const pool = await getConnection()

    const updatedAvatar = await pool
      .request()
      .input('id', sql.Int, id)
      .input('publicId', sql.VarChar, publicId)
      .input('url', sql.VarChar, url)
      .query(`
        UPDATE Imagem
        SET PublicID = @publicId, Url = @url
        WHERE Artigo_ID = @id
      `)

    await closeConnection(pool)

    return updatedAvatar.rowsAffected[0] > 0
  }
}

export default ItemRepository
