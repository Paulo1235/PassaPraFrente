import sql from 'mssql'

import { dbConfig, getConnection } from '../database/db-config.js'
import ItemRepository from './item-repository.js'

class SaleRepository {
  static async createSale ({ data, userId }) {
    const pool = await getConnection(dbConfig)

    const item = await ItemRepository.createItem(data.condition, data.category)

    const sale = await pool
      .request()
      .input('titulo', sql.VarChar, data.title)
      .input('descricao', sql.VarChar, data.description)
      .input('valor', sql.Int, data.price)
      .input('userId', sql.Int, userId)
      .input('itemId', sql.Int, item.Artigo_ID)
      .query(`
        INSERT INTO 
        Venda (Titulo, Descricao, Valor, Utilizador_ID, Artigo_ID, Estado_ID)
        VALUES (@titulo, @descricao, @valor, @userId, @itemId, 1)
      `)

    return sale.rowsAffected[0] > 0
  }

  static async getSaleById (id) {
    const pool = await getConnection(dbConfig)

    const sale = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT Venda_ID, Titulo, Descricao, Valor, NomeCategoria, Condicao, Contacto, Venda.Utilizador_ID
        FROM Venda
        JOIN Utilizador ON Utilizador.Utilizador_ID = Venda.Utilizador_ID
        JOIN Artigo ON Artigo.Artigo_ID = Venda.Artigo_ID
        JOIN Categoria ON Categoria.Categoria_ID = Artigo.Categoria_ID
        JOIN Condicao ON Condicao.Condicao_ID = Artigo.Condicao_ID
        WHERE Venda_ID = @id
      `)

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

export default SaleRepository
