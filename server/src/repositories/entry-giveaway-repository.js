import sql from 'mssql'

import { getConnection } from '../database/db-config'

class EntryGiveawayRepository {
  static async createEntryGiveaway (data) {
    const pool = await getConnection()

    const entryGiveaway = await pool
      .request()
      .input('giveawayId', sql.Int, data.giveawayId)
      .input('userId', sql.Int, data.userId)
      .input('entryDate', sql.DateTime, data.entryDate)
      .query(`
        INSERT INTO InscricaoSorteio (UtilizadorUtilizador_ID, SorteioSorteio_ID, DataInscricao) 
        VALUES (@userId, @giveawayId, @entryDate)
      `)

    return entryGiveaway.rowsAffected[0] > 0
  }

  static async getEntryGiveawayById (giveawayId, userId) {
    const pool = await getConnection()

    const entryGiveaway = await pool
      .request()
      .input('giveawayId', sql.Int, giveawayId)
      .input('userId', sql.Int, userId)
      .query(`
        SELECT * 
        FROM InscricaoSorteio 
        WHERE SorteioSorteio_ID = @giveawayId AND UtilizadorUtilizador_ID = @userId
      `)

    return entryGiveaway.recordset[0]
  }

  static async getAllEntryGiveawaysByUserId (userId) {
    const pool = await getConnection()

    const entryGiveaways = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT * 
        FROM InscricaoSorteio 
        WHERE UtilizadorUtilizador_ID = @userId
      `)

    return entryGiveaways.recordset
  }

  static async getAllEntryGiveawaysByGiveaway (giveawayId) {
    const pool = await getConnection()

    const entryGiveaways = await pool
      .request()
      .input('giveawayId', sql.Int, giveawayId)
      .query(`
        SELECT * 
        FROM InscricaoSorteio 
        WHERE SorteioSorteio_ID = @giveawayId
      `)

    return entryGiveaways.recordset
  }
}

export default EntryGiveawayRepository
