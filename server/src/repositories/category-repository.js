import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class CategoryRepository {
  static async getCategoryById (category) {
    const pool = await getConnection()

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
}

export default CategoryRepository
