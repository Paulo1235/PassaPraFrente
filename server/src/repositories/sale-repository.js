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
    const pool = await getConnection(dbConfig)
    const userSales = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        Select * 
        FROM Venda
        Where Venda.Venda_ID = @id
      `)
    await closeConnection(pool)
    return userSales.recordset
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
        Select * 
        FROM Venda
        Join Estado on Estado.Estado_ID = Venda.Estado_ID
        Where Estado = 'Disponivel'
      `)
    await closeConnection(pool)
    return availableSales.recordset
  }

  static async updateSale (data) {
    const pool = await getConnection(dbConfig)
    const updateSale = await pool.request()
      .input('titulo', sql.VarChar, data.title)
      .input('descricao', sql.VarChar, data.description)
      .input('valor', sql.Real, data.value)
      .input('idVenda', sql.Int, data.idsale)
      .query(`
        UPDATE Venda
        SET 
            Titulo = @titulo,
            Descricao = @descricao,
            Valor = @valor,
            Aprovado = 0
        WHERE Venda_ID = 1; 
      `)
    await closeConnection(pool)
    return updateSale.recordset
  }

  static async getUserSales (userId) {
    const pool = await getConnection(dbConfig)
    const userSales = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        Select * 
        FROM Venda
        Where Venda.Utilizador_ID = @userId
      `)
    await closeConnection(pool)
    return userSales.recordset
  }

  static async updateSalePictures () {

  }
}
