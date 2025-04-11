import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class WinnerGiveawayRepository {
  static async createWinnerGiveaway (data) {
    const pool = await getConnection()

    const winnerGiveaway = await pool.request()
      .input('userId', sql.Int, data.userId)
      .input('giveawayId', sql.Int, data.giveawayId)
      .query(`
        INSERT INTO VencedorSorteio (Nota, InscricaoSorteioUtilizadorUtilizador_ID, InscricaoSorteioSorteioSorteio_ID) 
        VALUES (0, @userId, @giveawayId)
      `)

    return winnerGiveaway.rowsAffected[0] > 0
  }

  static async getWinnerGiveawayById (giveawayId) {
    const pool = await getConnection()

    const winnerGiveaway = await pool.request()
      .input('giveawayId', sql.Int, giveawayId)
      .query(`
        SELECT * 
        FROM VencedorSorteio 
        WHERE InscricaoSorteioSorteioSorteio_ID = @giveawayId
      `)

    return winnerGiveaway.recordset[0]
  }

  static async getAllWinnersGiveawaysByUserId (userId) {
    const pool = await getConnection()

    const winnersGiveaways = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT * 
        FROM VencedorSorteio 
        WHERE InscricaoSorteioUtilizadorUtilizador_ID = @userId
      `)

    return winnersGiveaways.recordset
  }
}

export default WinnerGiveawayRepository
