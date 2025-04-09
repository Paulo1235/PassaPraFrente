import sql from 'mssql'

import { getConnection } from '../database/db-config.js'
import ItemRepository from './item-repository.js'

class GiveawayRepository {
  static async createGiveaway (data) {
    const pool = await getConnection()

    const item = await ItemRepository.createItem(data.condition, data.category)

    const giveaway = await pool
      .request()
      .input('dataInicio', sql.DateTime, data.startDate)
      .input('dataFim', sql.DateTime, data.endDate)
      .input('titulo', sql.VarChar, data.title)
      .input('descricao', sql.VarChar, data.description)
      .input('itemId', sql.Int, item.Artigo_ID)
      .input('estadoId', sql.Int, 1)

    return giveaway.recordset[0]
  }

  static async getGiveawayById (id) {
    const pool = await getConnection()

    const giveaway = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT * 
        FROM Giveaway
        WHERE Giveaway.Giveaway_ID = @id
      `)

    return giveaway.recordset[0]
  }

  static async getAllGiveaways () {
    const pool = await getConnection()

    const giveaways = await pool
      .request()
      .query(`
        SELECT * 
        FROM Giveaway
      `)

    return giveaways.recordset
  }

  static async getAvailableGiveaways () {
    const pool = await getConnection()

    const availableGiveaways = await pool
      .request()
      .query(`
        SELECT * 
        FROM Giveaway
        WHERE Giveaway.Estado_ID = 1
      `)

    return availableGiveaways.recordset
  }

  static async updateGiveaway (id, giveaway) {
    const pool = await getConnection()

    const updatedGiveaway = await pool
      .request()
      .input('id', sql.Int, id)
      .input('dataInicio', sql.DateTime, giveaway.startDate)
      .input('dataFim', sql.DateTime, giveaway.endDate)
      .input('titulo', sql.VarChar, giveaway.title)
      .input('descricao', sql.VarChar, giveaway.description)
      .input('estado', sql.Int, giveaway.date)
      .query(`
        UPDATE Giveaway
        SET Data_Inicio = @dataInicio,
            Data_Fim = @dataFim,
            Titulo = @titulo,
            Descricao = @descricao
            Estado_ID = @estado
        WHERE Giveaway_ID = @id
      `)

    return updatedGiveaway.recordset[0]
  }
}

export default GiveawayRepository
