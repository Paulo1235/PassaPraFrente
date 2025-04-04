import sql from 'mssql'

import { closeConnection, dbConfig, getConnection } from '../database/db-config.js'
import { ItemRepository } from './item-repository.js'

export class SaleRepository {
  static async createSale (fullData) {
    const pool = await getConnection(dbConfig)

    const data = fullData.saleData

    const item = await ItemRepository.createItem(data.condition, data.category)

    const sale = await pool
      .request()
      .input('titulo', sql.VarChar, data.titulo)
      .input('descricao', sql.VarChar, data.descricao)
      .input('valor', sql.Int, data.valor)
      .input('userId', sql.Int, fullData.userId)
      .input('itemId', sql.Int, item.Artigo_ID)
      .query(`
        INSERT INTO 
        Venda (Titulo, Descricao, Valor, Utilizador_ID, Artigo_ID, Estado_ID)
        VALUES (@titulo, @descricao, @valor, @userId, @itemId, 1)
      `)

    await closeConnection(pool)

    return sale.rowsAffected[0] > 0
  }

  static async getSaleById (id) {
    const pool = await getConnection(dbConfig)

    const sale = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT * 
        FROM Venda
        WHERE Venda.Venda_ID = @id
      `)
    await closeConnection(pool)

    return sale.recordset[0]
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
    const pool = await getConnection(dbConfig)

    const availableSales = await pool
      .request()
      .query(`
        SELECT * 
        FROM Venda
        JOIN Estado ON Estado.Estado_ID = Venda.Estado_ID
        WHERE Estado = 'Disponível'
      `)
    await closeConnection(pool)

    return availableSales.recordset
  }

  static async updateSale (data, id) {
    const pool = await getConnection(dbConfig)

    const updateSale = await pool.request()
      .input('titulo', sql.VarChar, data.title)
      .input('descricao', sql.VarChar, data.description)
      .input('valor', sql.Float, data.value)
      .input('idVenda', sql.Int, id)
      .query(`
        UPDATE Venda
        SET 
            Titulo = @titulo,
            Descricao = @descricao,
            Valor = @valor
        WHERE Venda_ID = @idVenda
      `)

    await closeConnection(pool)

    return updateSale.rowsAffected[0] > 0
  }

  static async getUserSales (userId) {
    const pool = await getConnection(dbConfig)

    const userSales = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT * 
        FROM Venda
        WHERE Venda.Utilizador_ID = @userId
      `)

    await closeConnection(pool)

    return userSales.recordset
  }

  static async updateSalePictures () {

  }

  static async updateSaleStatus (saleId, stateId) {
    const pool = await getConnection()

    const updatedSale = await pool
      .request()
      .input('saleId', sql.Int, saleId)
      .input('stateId', sql.Int, stateId)
      .query(`
        UPDATE Venda
        SET Estado_ID = @stateId
        WHERE Venda_ID = @saleId
      `)

    return updatedSale.rowsAffected[0] > 0
  }
}
