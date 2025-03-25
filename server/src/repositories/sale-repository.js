import sql from 'mssql'

import { closeConnection, dbConfig, getConnection } from '../database/db-config.js'
import { ItemRepository } from './item-repository.js'

export class SaleRepository {
  static async createSale (data) {
    const pool = await getConnection(dbConfig)

    const item = await ItemRepository.createItem(data.condition, data.category)

    const sale = await pool
      .request()
      .input('titulo', sql.VarChar, data.titulo)
      .input('descricao', sql.VarChar, data.descricao)
      .input('valor', sql.Int, data.valor)
      .input('userId', sql.Int, data.userId)
      .input('itemId', sql.Int, item.Artigo_ID)
      .query(`
        INSERT INTO 
        Venda(Titulo, Descricao, Valor, Utilizador_ID, Artigo_ID, Estado_ID) 
        VALUES (@titulo, @descricao, @valor, @userId, @itemId, 1)
      `)

    await closeConnection(pool)

    return sale.recordset[0]
  }

  static async getSaleById (id) {

  }

  static async getAllSales () {
    const pool = await getConnection(dbConfig)

    const sales = await pool
      .request()
      .query(`
        SELECT * 
        FROM Venda
      `)

    await closeConnection(pool)

    return sales.recordset
  }

  static async getAvailableSales () {

  }

  static async updateSale (data) {

  }

  static async getUserSales (userId) {

  }

  static async updateSalePictures () {

  }
}
